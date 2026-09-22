export async function onRequestPost(context) {
  const { request, env } = context;

  // Configuração dos cabeçalhos CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json; charset=UTF-8',
  };

  try {
    // Processamento do formulário multipart/form-data
    const formData = await request.formData();

    const nome = formData.get('nome') || 'Não informado';
    const dataNascimento = formData.get('dataNascimento') || 'Não informada';
    const idade = formData.get('idade') || 'Não informada';
    const batizado = formData.get('batizado') || 'Não informado';
    const eucaristia = formData.get('eucaristia') || 'Não informado';
    const celular = formData.get('celular') || 'Não informado';
    const endereco = formData.get('endereco') || 'Não informado';
    const pai = formData.get('pai') || 'Não informado';
    const mae = formData.get('mae') || 'Não informado';
    const responsavel = formData.get('responsavel') || 'Não informado';

    // Processamento dos ficheiros anexados
    const files = formData.getAll('anexos[]');
    if (!files || files.length === 0 || !(files[0] instanceof File)) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'É necessário anexar pelo menos um arquivo.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const attachments = [];
    let totalSizeBytes = 0;
    const maxSizeBytes = 9 * 1024 * 1024; // Limitador de 9 MB

    for (const file of files) {
      if (file instanceof File) {
        totalSizeBytes += file.size;

        if (totalSizeBytes > maxSizeBytes) {
          return new Response(
            JSON.stringify({
              status: 'error',
              message: 'A soma total dos arquivos excede o limite de 9 MB.',
            }),
            { status: 400, headers: corsHeaders }
          );
        }

        // Converte o ficheiro em ArrayBuffer e depois para Base64
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Content = btoa(binary);

        attachments.push({
          content: base64Content,
          filename: file.name,
          type: file.type || 'application/octet-stream',
          disposition: 'attachment',
        });
      }
    }

    // Estruturação do HTML do e-mail
    const htmlBody = `
    <!DOCTYPE html>
    <html lang='pt-BR'>
    <head><meta charset='UTF-8'></head>
    <body style='margin: 0; padding: 20px; background-color: #f4f6f9; font-family: Arial, sans-serif; color: #333;'>
      <table role='presentation' width='100%' cellspacing='0' cellpadding='0' style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;'>
        <tr>
          <td style='background-color: #0d6efd; padding: 24px; text-align: center; color: #ffffff;'>
            <h1 style='margin: 0; font-size: 20px;'>Paróquia Nossa Senhora de Fátima</h1>
            <p style='margin: 6px 0 0 0; font-size: 14px;'>Catequese de Iniciação à Vida Cristã</p>
          </td>
        </tr>
        <tr>
          <td style='padding: 24px;'>
            <h2 style='margin: 0 0 16px 0; font-size: 18px; color: #0d6efd;'>Nova Inscrição Recebida</h2>
            <p><strong>Nome Completo:</strong> ${nome}</p>
            <p><strong>Data de Nascimento:</strong> ${dataNascimento} (${idade} anos)</p>
            <p><strong>É Batizado?</strong> ${batizado}</p>
            <p><strong>Recebeu Eucaristia?</strong> ${eucaristia}</p>
            <hr>
            <p><strong>Celular / WhatsApp:</strong> ${celular}</p>
            <p><strong>Endereço:</strong> ${endereco}</p>
            <p><strong>Nome da Mãe:</strong> ${mae}</p>
            <p><strong>Nome do Pai:</strong> ${pai}</p>
            <p><strong>Responsável Legal:</strong> ${responsavel}</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // Leitura das variáveis de ambiente secretas
    const payload = {
      from: {
        email: env.MAILTRAP_SENDER_EMAIL,
        name: 'Catequese Paroquial',
      },
      to: [{ email: env.MAILTRAP_RECIPIENT_EMAIL }],
      subject: `Inscrição Catequese: ${nome}`,
      html: htmlBody,
      attachments: attachments,
    };

    // Disparo da requisição para o Mailtrap
    const mailtrapResponse = await fetch('https://send.api.mailtrap.io/api/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.MAILTRAP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (mailtrapResponse.ok) {
      return new Response(
        JSON.stringify({ status: 'success', message: 'Inscrição enviada com sucesso!' }),
        { status: 200, headers: corsHeaders }
      );
    } else {
      const errorData = await mailtrapResponse.text();
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Erro ao disparar e-mail via Mailtrap.',
          details: errorData,
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 'error', message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Trata requisições preflight OPTIONS
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}