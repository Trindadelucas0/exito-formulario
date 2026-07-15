// Campos obrigatórios de cada bloco condicional (exceto observações da baixa, que é opcional)
const camposObrigatoriosPorBloco = {
    'bloco-dados-cadastrais': ['novo_nome_fantasia', 'nova_razao_social', 'novo_endereco', 'novo_tipo_sociedade'],
    'bloco-quadro-societario': ['socio_a_retirar', 'novo_socio_nome', 'transferencia_cotas'],
    'bloco-retirada-atividades': ['cnaes_retirar'],
    'bloco-novas-atividades': ['cnaes_incluir'],
    'bloco-abertura-filial': ['dados_filial'],
    'bloco-baixa-empresa': [],
    'bloco-outras-alteracoes': ['descricao_alteracao']
};

function alternarBlocoCondicional(checkbox) {
    const blocoId = checkbox.dataset.bloco;
    const bloco = document.getElementById(blocoId);
    if (!bloco) return;

    const camposObrigatorios = camposObrigatoriosPorBloco[blocoId] || [];

    if (checkbox.checked) {
        bloco.style.display = 'block';
        camposObrigatorios.forEach(nomeCampo => {
            const campo = bloco.querySelector(`[name="${nomeCampo}"]`);
            if (campo) campo.required = true;
        });
    } else {
        bloco.style.display = 'none';
        bloco.querySelectorAll('input, textarea, select').forEach(campo => {
            campo.value = '';
            campo.required = false;
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-briefing');
    if (form && !form.querySelector('.logo-vision-ads')) {
        const img = document.createElement('img');
        img.src = '/img/vision 3.png';
        img.alt = 'Logo Vision Ads';
        img.className = 'logo-vision-ads';
        form.prepend(img);
    }

    document.querySelectorAll('input[name="tipo_alteracao"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            alternarBlocoCondicional(this);
        });
    });
});

document.getElementById('form-briefing').addEventListener('submit', function (e) {
    e.preventDefault();

    const tiposMarcados = Array.from(document.querySelectorAll('input[name="tipo_alteracao"]:checked'));
    if (tiposMarcados.length === 0) {
        alert('⚠️ Selecione ao menos um tipo de alteração contratual.');
        return;
    }

    const btn = document.getElementById('btn-enviar');
    const btnSpan = btn.querySelector('span');
    btn.disabled = true;
    btnSpan.innerText = 'ENVIANDO DADOS...';

    const formData = new FormData(this);

    const payload = {
        razao_social_atual: formData.get('razao_social_atual'),
        cnpj_empresa: formData.get('cnpj_empresa'),
        telefone_contato: formData.get('telefone_contato'),
        email_contato: formData.get('email_contato'),
        tipos_alteracao: tiposMarcados.map(cb => cb.value),
        novo_nome_fantasia: formData.get('novo_nome_fantasia'),
        nova_razao_social: formData.get('nova_razao_social'),
        novo_endereco: formData.get('novo_endereco'),
        novo_tipo_sociedade: formData.get('novo_tipo_sociedade'),
        socio_a_retirar: formData.get('socio_a_retirar'),
        novo_socio_nome: formData.get('novo_socio_nome'),
        transferencia_cotas: formData.get('transferencia_cotas'),
        cnaes_retirar: formData.get('cnaes_retirar'),
        cnaes_incluir: formData.get('cnaes_incluir'),
        dados_filial: formData.get('dados_filial'),
        obs_baixa: formData.get('obs_baixa'),
        descricao_alteracao: formData.get('descricao_alteracao')
    };

    fetch('/api/alteracao-contratual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(async response => {
            const data = await response.json();
            if (!response.ok || !data.ok) throw new Error(data.message || 'Falha ao enviar');
            return data;
        })
        .then(data => {
            window.location.href = data.redirect;
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('❌ Ocorreu um erro ao enviar. Tente novamente.');
            btn.disabled = false;
            btnSpan.innerText = '✨ Enviar Solicitação';
        });
});
