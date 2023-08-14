import { CaixaDaLanchonete } from "./caixa-da-lanchonete.js";

describe('CaixaDaLanchonete', () => {
// Função auxiliar para validar um teste
    const validaTeste = (formaDePagamento, resultadoEsperado, itens) => {
// Cria uma instância de CaixaDaLanchonete e calcula o valor da compra 
    const resultado = new CaixaDaLanchonete()
            .calcularValorDaCompra(formaDePagamento, itens);
 // Verifica se o resultado do cálculo é igual ao resultado esperado
        expect(resultado.replace("\xa0", " ")).toEqual(resultadoEsperado);
    };

    // Teste para diferentes cenários de carrinho vazio
    test.each([
        ['com carrinho vazio', 'dinheiro', 'Não há itens no carrinho de compra!', []],
        ['com carrinho vazio', 'credito', 'Não há itens no carrinho de compra!', []],
        ['com carrinho vazio', 'debito', 'Não há itens no carrinho de compra!', []],
    ])('compra %p em %p deve resultar em %p', (_, formaDePagamento, resultadoEsperado, itens) =>
        validaTeste(formaDePagamento, resultadoEsperado, itens));
 // Testes para diferentes cenários de compras simples
    test.each([
        ['dinheiro', 'R$ 2,85', ['cafe,1']],
        ['credito', 'R$ 3,09', ['cafe,1']],
        ['debito', 'R$ 3,00', ['cafe,1']],
    ])('compra simples em %p deve resultar em %p', validaTeste);

    test.each([
        ['credito', 'R$ 11,85', ['cafe,1', 'sanduiche,1', 'queijo,1']],
        ['debito', 'R$ 11,50', ['cafe,1', 'sanduiche,1', 'queijo,1']],
    ])('compra de 3 itens em %p deve resultar em %p', validaTeste);

    test.each([
        ['dinheiro', 'R$ 33,73', ['cafe,4', 'sanduiche,3', 'queijo,2']],
        ['credito', 'R$ 36,56', ['cafe,4', 'sanduiche,3', 'queijo,2']],
        ['debito', 'R$ 35,50', ['cafe,4', 'sanduiche,3', 'queijo,2']],
    ])('compra de múltiplas quantidades em %p deve resultar em %p', validaTeste);

    test.each([
        ['com quantidade zero', 'dinheiro', 'Quantidade inválida!', ['cafe,0']],
        ['com um valor', 'credito', 'Item inválido!', ['1']],
        ['com código inexistente', 'debito', 'Item inválido!', ['pizza, 1']],
        ['com forma de pagamento inválida', 'especie', 'Forma de pagamento inválida!', ['cafe, 1']],
    ])('compra %p em %p deve resultar em %p', (_, formaDePagamento, resultadoEsperado, itens) =>
        validaTeste(formaDePagamento, resultadoEsperado, itens));

    test.each([
        ['chantily', 'dinheiro', 'Item extra não pode ser pedido sem o principal', ['chantily,1']],
        ['queijo', 'credito', 'Item extra não pode ser pedido sem o principal', ['queijo,1']],
        ['chantily com outro item', 'credito', 'Item extra não pode ser pedido sem o principal', ['chantily,1', 'sanduiche,1']],
        ['queijo com outro item', 'debito', 'Item extra não pode ser pedido sem o principal', ['cafe,1', 'queijo,1']],
    ])('compra %p em %p deve resultar em %p', (_, formaDePagamento, resultadoEsperado, itens) =>
        validaTeste(formaDePagamento, resultadoEsperado, itens));
});
// Mais variados tipos de testes acima

// Definição do cardápio com descrições e valores dos itens
const cardapio = {
    cafe: { descricao: "Café", valor: 3.00 },
    chantily: { descricao: "Chantily (extra do Café)", valor: 1.50 },
    suco: { descricao: "Suco Natural", valor: 6.20 },
    sanduiche: { descricao: "Sanduíche", valor: 6.50 },
    queijo: { descricao: "Queijo (extra do Sanduíche)", valor: 2.00 },
    salgado: { descricao: "Salgado", valor: 7.25 },
    combo1: { descricao: "1 Suco e 1 Sanduíche", valor: 9.50 },
    combo2: { descricao: "1 Café e 1 Sanduíche", valor: 7.50 }
  };
     // Função para calcular o valor do pedido com base no cardápio e regras
function calcularValorDaCompra(pedido, formaPagamento) {
    let valorTotal = 0;
  
    if (pedido.length === 0) {
      return "Não há itens no carrinho de compra!";
    }
  
    for (const itemPedido of pedido) {
      const item = cardapio[itemPedido.codigo];
  
      if (!item) {
        return "Item inválido!";
      }
  
      if (itemPedido.extra && !cardapio[itemPedido.extra]) {
        return "Item extra não pode ser pedido sem o principal";
      }
  
      valorTotal += item.valor;
  
      if (itemPedido.extra) {
        valorTotal += cardapio[itemPedido.extra].valor;
      }
    }
  
    if (formaPagamento === "dinheiro") {
      valorTotal *= 0.95;
    } else if (formaPagamento === "credito") {
      valorTotal *= 1.03;
    } else if (formaPagamento !== "debito") {
      return "Forma de pagamento inválida!";
    }
  
    return `Total a pagar: R$ ${valorTotal.toFixed(2)}`;
  }
  // Exemplo de pedido e forma de pagamento
  const pedidoExemplo = [
    { codigo: "cafe" },
    { codigo: "chantily", extra: "cafe" },
    { codigo: "suco" }
  ];
  const formaPagamentoExemplo = "dinheiro";
   // Chamando a função para calcular o valor do pedido de exemplo
  const valorPedido = calcularValorDaCompra(pedidoExemplo, formaPagamentoExemplo);
  console.log(valorPedido); // Exibe o valor calculado no console
   