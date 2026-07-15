document.addEventListener('DOMContentLoaded', function () {
    // Alternância de abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // Expande/colapsa os detalhes de cada envio
    document.querySelectorAll('[data-toggle-details]').forEach(summary => {
        summary.addEventListener('click', function () {
            this.nextElementSibling.classList.toggle('open');
        });
    });

    // Mostra/oculta o texto numerado (formato usado antes no SheetMonkey)
    document.querySelectorAll('[data-toggle-raw]').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.submission-details');
            card.querySelector('[data-raw-text]').classList.toggle('open');
        });
    });

    function marcarCopiado(btn, textoOriginal) {
        btn.classList.add('copiado');
        btn.textContent = '✅ Copiado!';
        setTimeout(() => {
            btn.classList.remove('copiado');
            btn.textContent = textoOriginal;
        }, 2000);
    }

    // Copia a ficha completa (texto numerado)
    document.querySelectorAll('[data-copy-text]').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.submission-details');
            const texto = card.querySelector('[data-raw-text]').value;
            navigator.clipboard.writeText(texto).then(() => marcarCopiado(this, '📋 Copiar ficha completa'));
        });
    });

    // Copia apenas o resumo de identificação
    document.querySelectorAll('[data-copy-resumo]').forEach(btn => {
        btn.addEventListener('click', function () {
            const resumo = `Empresa: ${this.dataset.empresa}\nTelefone: ${this.dataset.telefone}\nE-mail: ${this.dataset.email}\nData: ${this.dataset.data}`;
            navigator.clipboard.writeText(resumo).then(() => marcarCopiado(this, '📋 Copiar resumo'));
        });
    });
});
