import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Adicionado
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';

// Validador de Nome Completo
export function nomeCompletoValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').trim();
  if (!value) return null;
  const partes = value.split(/\s+/);
  const temSobrenome = partes.length >= 2;
  const nomesValidos = partes.every((parte: string) => parte.length >= 2);
  return temSobrenome && nomesValidos ? null : { nomeIncompleto: true };
}

// Validador customizado para Idade (menor que 100 anos e maior/igual a 0)
export function idadeValidaValidator(control: AbstractControl): ValidationErrors | null {
  const dataNascimento = control.value;
  if (!dataNascimento) return null;

  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  
  if (nascimento > hoje) {
    return { dataFutura: true }; // Data no futuro não é permitida
  }

  const idade = calcularIdade(dataNascimento);

  if (idade >= 100) {
    return { idadeMuitoAlta: true }; // Idade deve ser menor que 100
  }

  return null;
}

// Função utilitária para calcular a idade exata
function calcularIdade(dataNascStr: string): number {
  if (!dataNascStr) return 0;
  const hoje = new Date();
  const nascimento = new Date(dataNascStr);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Catequese';
  formulario: FormGroup;
  arquivosAnexados: File[] = [];
  erroTamanhoMaximo: boolean = false;
  tamanhoTotalMB: number = 0;
  isSubmitting: boolean = false; // Controle de estado de carregamento
  mensagemFeedback: { tipo: 'success' | 'danger'; texto: string } | null = null;

  readonly TAMANHO_MAXIMO_BYTES = 9 * 1024 * 1024;
  private readonly API_URL = 'https://op.douglascarlos.dev/send-email.php';

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const novosArquivos = Array.from(input.files);

    // Acumula os novos arquivos mantendo os anteriores
    const listaProvisoria = [...this.arquivosAnexados, ...novosArquivos];

    // Calcula o tamanho total em bytes
    const totalBytes = listaProvisoria.reduce((acc, file) => acc + file.size, 0);

    if (totalBytes > this.TAMANHO_MAXIMO_BYTES) {
      this.erroTamanhoMaximo = true;
    } else {
      this.erroTamanhoMaximo = false;
      this.arquivosAnexados = listaProvisoria;
      this.atualizarTamanhoTotal();
    }

    // Reseta o input file para permitir selecionar o mesmo arquivo se desejar
    input.value = '';
  }

  removerArquivo(index: number): void {
    this.arquivosAnexados.splice(index, 1);
    this.atualizarTamanhoTotal();
    
    if (this.calcularTamanhoTotalBytes() <= this.TAMANHO_MAXIMO_BYTES) {
      this.erroTamanhoMaximo = false;
    }
  }

  private calcularTamanhoTotalBytes(): number {
    return this.arquivosAnexados.reduce((acc, file) => acc + file.size, 0);
  }

  private atualizarTamanhoTotal(): void {
    const bytes = this.calcularTamanhoTotalBytes();
    this.tamanhoTotalMB = parseFloat((bytes / (1024 * 1024)).toFixed(2));
    
    // Atualiza a validação do campo virtual
    this.formulario.patchValue({
      temAnexos: this.arquivosAnexados.length > 0
    });
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient // Injeção do HttpClient
  ) {
    this.formulario = this.fb.group({
      nomeCompleto: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'+]+$/),
          nomeCompletoValidator
        ]
      ],
      dataNascimento: ['', [Validators.required, idadeValidaValidator]],
      idade: [{ value: '', disabled: false }, [Validators.required]], // Será atualizado automaticamente
      batizado: ['', Validators.required],
      eucaristia: ['', Validators.required],
      celular: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\(?\d{2}\)?\s?)?9\d{4}[-\s]?\d{4}$/)
        ]
      ],
      
      // Validação de Endereço Completo (mínimo de 10 caracteres)
      endereco: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ],

      // Reutilizando o nomeCompletoValidator para os responsáveis
      pai: ['', [Validators.required, nomeCompletoValidator]],
      mae: ['', [Validators.required, nomeCompletoValidator]],
      responsavel: ['', [Validators.required, nomeCompletoValidator]],
      // Validação obrigatória para Checkbox de Aceite
      aceiteDocumentos: [false, Validators.requiredTrue],
      temAnexos: [false, Validators.requiredTrue]
    });
  }

  // Getter auxiliar para facilitar o acesso no template
  get aceiteDocumentos() { 
    return this.formulario.get('aceiteDocumentos'); 
  }

  ngOnInit(): void {
    // Escuta as alterações na Data de Nascimento para atualizar o campo Idade
    this.formulario.get('dataNascimento')?.valueChanges.subscribe((dataNasc) => {
      const campoData = this.formulario.get('dataNascimento');
      
      if (campoData?.valid && dataNasc) {
        const idadeCalculada = calcularIdade(dataNasc);
        this.formulario.patchValue({ idade: idadeCalculada });
      } else {
        this.formulario.patchValue({ idade: '' });
      }
    });
  }

  // Getters para os campos do formulário
  get nomeCompleto() { return this.formulario.get('nomeCompleto'); }
  get dataNascimento() { return this.formulario.get('dataNascimento'); }
  get idade() { return this.formulario.get('idade'); }
  get batizado() { return this.formulario.get('batizado'); }
  get eucaristia() { return this.formulario.get('eucaristia'); }
  get celular() { return this.formulario.get('celular'); }
  get endereco() { return this.formulario.get('endereco'); }
  get pai() { return this.formulario.get('pai'); }
  get mae() { return this.formulario.get('mae'); }
  get responsavel() { return this.formulario.get('responsavel'); }
  get temAnexos() { return this.formulario.get('temAnexos'); }

  onSubmit(): void {
    if (this.formulario.invalid || this.arquivosAnexados.length === 0) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.mensagemFeedback = null;

    // Construção do FormData para envio multipart/form-data
    const formData = new FormData();
    const values = this.formulario.getRawValue(); // pega valores inclusive de campos disabled como idade

    formData.append('nome', values.nomeCompleto);
    formData.append('dataNascimento', values.dataNascimento);
    formData.append('idade', values.idade);
    formData.append('batizado', values.batizado);
    formData.append('eucaristia', values.eucaristia);
    formData.append('celular', values.celular);
    formData.append('endereco', values.endereco);
    formData.append('pai', values.pai);
    formData.append('mae', values.mae);
    formData.append('responsavel', values.responsavel);

    // Anexa a lista de arquivos no formato esperado pelo PHP (anexos[])
    this.arquivosAnexados.forEach((arquivo) => {
      formData.append('anexos[]', arquivo, arquivo.name);
    });

    // Envio da requisição POST
    this.http.post<{ status: string; message: string }>(this.API_URL, formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.mensagemFeedback = {
          tipo: 'success',
          texto: response.message
        };
        this.resetarFormulario();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.mensagemFeedback = {
          tipo: 'danger',
          texto: err.error?.message || 'Ocorreu um erro ao enviar a inscrição.'
        };
      }
    });
  }

  private resetarFormulario(): void {
    this.formulario.reset({
      aceiteDocumentos: false,
      temAnexos: false
    });
    this.arquivosAnexados = [];
    this.tamanhoTotalMB = 0;
    this.erroTamanhoMaximo = false;
  }
}