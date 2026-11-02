import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, FileText, CircleHelp, RefreshCcw, Shield, PackageSearch } from 'lucide-react';
import './LegalPage.css';

const PAGE_CONTENT = {
  privacidade: {
    label: 'Política de Privacidade',
    title: 'Como protegemos seus dados',
    lead: 'A PowerCell coleta apenas o necessário para oferecer uma experiência segura, clara e eficiente em compras e atendimento.',
    sections: [
      {
        title: '1. Informações que coletamos',
        body: [
          'Coletamos dados cadastrais, como nome, e-mail, telefone e endereço, além de informações necessárias para concluir compras, emitir nota fiscal e prestar suporte.',
          'Também registramos dados de navegação e uso do site para melhorar a experiência, identificar comportamentos e reforçar a segurança das transações.'
        ]
      },
      {
        title: '2. Uso dos dados',
        body: [
          'Esses dados são utilizados para processar pedidos, confirmar entregas, responder dúvidas, personalizar ofertas e aprimorar nosso atendimento.',
          'Não compartilhamos suas informações pessoais com terceiros, exceto quando exigido por lei ou por parceiros estritamente necessários para a execução do serviço.'
        ]
      },
      {
        title: '3. Segurança',
        body: [
          'Utilizamos medidas técnicas e administrativas para proteger seus dados contra acesso não autorizado, uso indevido, alteração ou perda.',
          'Mesmo com os cuidados adotados, nenhum ambiente digital é impenetrável, por isso seguimos reforçando nossos controles e boas práticas de segurança.'
        ]
      },
      {
        title: '4. Seus direitos',
        body: [
          'Você pode solicitar acesso, correção, exclusão ou atualização de seus dados pessoais a qualquer momento, entrando em contato com nossa equipe.',
          'Também pode solicitar a revogação do consentimento para marketing, caso prefira receber menos comunicações de nossa parte.'
        ]
      }
    ]
  },
  termos: {
    label: 'Termos de Uso',
    title: 'Regras do uso do nosso site',
    lead: 'Ao navegar e comprar na PowerCell, você concorda com as regras abaixo que orientam a relação entre loja e cliente.',
    sections: [
      {
        title: '1. Acesso e cadastro',
        body: [
          'Para finalizar compras, você deve fornecer dados válidos e manter o cadastro sempre atualizado. A responsabilidade sobre a veracidade das informações é do cliente.',
          'É proibido utilizar a loja para atividades ilícitas, fraudulentas, abusivas ou que tenham como objetivo prejudicar terceiros.'
        ]
      },
      {
        title: '2. Produtos e preços',
        body: [
          'Os produtos são exibidos com a maior precisão possível, porém podem haver variações de cor, acabamento ou disponibilidade conforme o estoque.',
          'Preços, promoções e condições podem ser alterados sem aviso prévio, especialmente em campanhas sazonais ou por questões operacionais.'
        ]
      },
      {
        title: '3. Pagamento e entrega',
        body: [
          'As compras são processadas somente após confirmação de pagamento e verificação de dados. O prazo de entrega pode variar de acordo com a região e o método escolhido.',
          'A PowerCell não se responsabiliza por atrasos causados por transportadoras, eventos climáticos ou fatores externos à nossa operação que impossibilitem a entrega dentro do prazo.'
        ]
      },
      {
        title: '4. Responsabilidade',
        body: [
          'A loja se compromete a oferecer produtos originais, com qualidade e suporte conforme as políticas vigentes.',
          'O uso do site é por sua conta e risco, e a PowerCell não se responsabiliza por danos indiretos decorrentes de falhas de terceiros, indisponibilidade do sistema ou uso inadequado da plataforma.'
        ]
      }
    ]
  },
  faq: {
    label: 'FAQ',
    title: 'Perguntas frequentes',
    lead: 'Abaixo estão as dúvidas mais comuns sobre compras, entregas, garantia e suporte em nossa loja.',
    sections: [
      {
        title: 'Como acompanhar meu pedido?',
        body: ['Você pode rastrear seu pedido pelo código de rastreio enviado por e-mail ou pela página de rastreio do site.']
      },
      {
        title: 'Qual é o prazo de entrega?',
        body: ['O prazo varia conforme a cidade e o frete escolhido, geralmente ficando entre 24 e 72 horas para regiões prioritárias.']
      },
      {
        title: 'Posso comprar por WhatsApp?',
        body: ['Sim. Nossa equipe também atende por WhatsApp para orientar sobre produtos, avaliações e pedidos especiais.']
      },
      {
        title: 'Os produtos são originais?',
        body: ['Sim. Trabalhamos com celulares e acessórios originais, com garantia e suporte direto do fabricante ou da loja.']
      }
    ]
  },
  trocas: {
    label: 'Trocas e Devoluções',
    title: 'Política de troca e devolução',
    lead: 'Queremos que você fique satisfeito com a compra. Confira o processo para trocas, devoluções e reembolsos.',
    sections: [
      {
        title: 'Troca por defeito ou divergência',
        body: ['Caso o produto chegue com defeito, avaria ou divergência em relação ao pedido, você pode solicitar troca ou devolução em até 7 dias corridos após o recebimento.']
      },
      {
        title: 'Troca por arrependimento',
        body: ['Quando o produto for entregue em perfeitas condições, a troca por arrependimento pode ser solicitada dentro do prazo previsto pela legislação, respeitando as condições do item e do estado de conservação.']
      },
      {
        title: 'Como solicitar',
        body: ['Entre em contato com nossa equipe pelo WhatsApp ou e-mail, informe o pedido, o motivo da solicitação e acompanhe as instruções para envio ou retirada.']
      }
    ]
  },
  garantia: {
    label: 'Garantia',
    title: 'Garantia e suporte técnico',
    lead: 'Nossa equipe oferece suporte para que seu investimento esteja sempre protegido com assistência e orientações de qualidade.',
    sections: [
      {
        title: 'Cobertura',
        body: ['A garantia cobre falhas de fabricação, defeitos de componentes e problemas que estejam dentro das condições previstas pelo fabricante e pela nossa política.']
      },
      {
        title: 'Exclusões',
        body: ['A garantia não cobre danos causados por uso indevido, quedas, infiltrações, modificações, acessos técnicos não autorizados ou problemas decorrentes de mau uso.']
      },
      {
        title: 'Atendimento',
        body: ['Para solicitar garantia ou suporte, envie os dados do pedido e a descrição do problema. Nossa equipe avaliará a melhor solução e o encaminhamento correto.']
      }
    ]
  },
  rastreio: {
    label: 'Rastreio',
    title: 'Acompanhe sua entrega',
    lead: 'Acompanhe seu pedido em tempo real e saiba em que etapa ele está, desde o preparo até a entrega final.',
    sections: [
      {
        title: 'Como rastrear',
        body: ['Assim que o pedido for enviado, você receberá um código de rastreio por e-mail e WhatsApp. Use esse código na página de rastreio ou na transportadora correspondente.']
      },
      {
        title: 'Status da entrega',
        body: ['Você verá as etapas do processo, como separação, despacho, em trânsito e entregue. Em caso de atraso, nossa equipe pode auxiliar com orientações e confirmação da logística.']
      },
      {
        title: 'Precisa de ajuda?',
        body: ['Se o rastreio não atualizar ou houver qualquer dúvida, fale com nossa equipe e vamos acompanhar junto à transportadora.']
      }
    ]
  }
};

const ICONS = {
  privacidade: ShieldCheck,
  termos: FileText,
  faq: CircleHelp,
  trocas: RefreshCcw,
  garantia: Shield,
  rastreio: PackageSearch
};

export default function LegalPage({ page = 'privacidade' }) {
  const content = PAGE_CONTENT[page] || PAGE_CONTENT.privacidade;
  const Icon = ICONS[page] || ShieldCheck;

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container">
          <span className="section-label sans">{content.label}</span>
          <h1 className="serif">{content.title}</h1>
          <p>{content.lead}</p>
        </div>
      </div>

      <div className="container legal-layout">
        {content.sections.map((section) => (
          <article className="legal-card glass" key={section.title}>
            <div className="legal-card-icon">
              <Icon size={22} />
            </div>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}

        <div className="legal-cta glass">
          <h3>Precisa de ajuda?</h3>
          <p>Fale com nossa equipe e resolva sua dúvida com agilidade.</p>
          <div className="legal-cta-actions">
            <Link to="/contato" className="btn btn-primary">
              Falar com o suporte <ArrowRight size={16} />
            </Link>
            <Link to="/produtos" className="btn btn-outline">
              Ver produtos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
