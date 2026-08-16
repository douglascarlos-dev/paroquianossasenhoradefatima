import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formData = {
    nome: '',
    dataNascimento: '',
    idade: null as number | null,
    batizado: '',
    eucaristia: '',
    celular: '',
    endereco: '',
    pai: '',
    mae: '',
    responsavel: '',
    motivacao: '',
    aceiteDocumentos: false
  };

  selectedFiles: File[] = [];
  totalFileSize: number = 0;
  fileSizeError: string | null = null;
  isSubmitting: boolean = false;
  submitMessage: string | null = null;
  isError: boolean = false;

  // Injetamos o ChangeDetectorRef no constructor
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  calcularIdade() {
    if (!this.formData.dataNascimento) {
      this.formData.idade = null;
      return;
    }
    const dataNasc = new Date(this.formData.dataNascimento + 'T00:00:00');
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    this.formData.idade = idade < 0 ? 0 : idade;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.totalFileSize = this.selectedFiles.reduce((acc, file) => acc + file.size, 0);

      const maxLimit = 9 * 1024 * 1024;
      if (this.totalFileSize > maxLimit) {
        this.fileSizeError = 'A soma de todos os arquivos selecionados ultrapassa o limite de 9 MB.';
      } else {
        this.fileSizeError = null;
      }
    }
  }

  onSubmit() {
  // 1. Validação de tamanho máximo
  if (this.fileSizeError) return;

  // 2. Validação de anexo obrigatório
  if (!this.selectedFiles || this.selectedFiles.length === 0) {
    this.fileSizeError = 'É obrigatório anexar pelo menos um documento para realizar a inscrição.';
    return;
  }

  this.isSubmitting = true;
  this.submitMessage = null;

  const payload = new FormData();
  Object.keys(this.formData).forEach(key => {
    payload.append(key, (this.formData as any)[key]);
  });

  for (let file of this.selectedFiles) {
    payload.append('anexos[]', file, file.name);
  }

  this.http.post('http://localhost:8086/send-email.php', payload, { responseType: 'json' }).subscribe({
    next: (res: any) => {
      this.isSubmitting = false;
      this.isError = false;
      this.submitMessage = 'Inscrição enviada com sucesso!';

      this.formData = {
        nome: '', dataNascimento: '', idade: null, batizado: '',
        eucaristia: '', celular: '', endereco: '', pai: '',
        mae: '', responsavel: '', motivacao: '', aceiteDocumentos: false
      };
      this.selectedFiles = [];
      this.totalFileSize = 0;
      this.fileSizeError = null;

      const fileInput = document.getElementById('anexos') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erro na requisição:', err);
      this.isSubmitting = false;
      this.isError = true;
      this.submitMessage = 'Erro ao enviar a inscrição. Verifique os dados.';
      this.cdr.detectChanges();
    }
  });
}
}