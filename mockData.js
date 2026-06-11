
const menuData = {
    salvador: [
        { id: 1, nome: "Baião de dois", descricao: "Arroz, feijão verde, carne seca, queijo coalho.", preco: 28.90, imagem: "images/baiao_de_dois.png" },
        { id: 2, nome: "Carne do sol na telha", descricao: "Carne do sol acebolada, mandioca, manteiga de garrafa.", preco: 42.90, imagem: "images/carne_do_sol.png" },
        { id: 3, nome: "Buchada de bode", descricao: "Tradicional buchada nordestina com acompanhamentos.", preco: 38.50, imagem: "images/buchada_de_bode.jpg" },
        { id: 4, nome: "Caldo de cana", descricao: "Caldo de cana natural com gengibre.", preco: 8.90, imagem: "images/caldo_de_cana.jpg" }
    ],
    recife: [ 
         { id: 1, nome: "Baião de dois", descricao: "Arroz, feijão verde, carne seca, queijo coalho.", preco: 28.90, imagem: "images/baiao_de_dois.png" },
        { id: 2, nome: "Carne do sol na telha", descricao: "Carne do sol acebolada, mandioca, manteiga de garrafa.", preco: 42.90, imagem: "images/carne_do_sol.png" },
        { id: 3, nome: "Buchada de bode", descricao: "Tradicional buchada nordestina com acompanhamentos.", preco: 38.50, imagem: "images/buchada_de_bode.jpg" },
        { id: 4, nome: "Caldo de cana", descricao: "Caldo de cana natural com gengibre.", preco: 8.90, imagem: "images/caldo_de_cana.jpg" }
    ],
    saopaulo: [  { id: 1, nome: "Baião de dois", descricao: "Arroz, feijão verde, carne seca, queijo coalho.", preco: 28.90, imagem: "images/baiao_de_dois.png" },
        { id: 2, nome: "Carne do sol na telha", descricao: "Carne do sol acebolada, mandioca, manteiga de garrafa.", preco: 42.90, imagem: "images/carne_do_sol.png" },
        { id: 3, nome: "Buchada de bode", descricao: "Tradicional buchada nordestina com acompanhamentos.", preco: 38.50, imagem: "images/buchada_de_bode.jpg" },
        { id: 4, nome: "Caldo de cana", descricao: "Caldo de cana natural com gengibre.", preco: 8.90, imagem: "images/caldo_de_cana.jpg" }
    ]
};
   

const promocoes = {
    salvador: { descricao: "🔥 Baião de dois com 10% OFF!", descontoPercent: 10, itemId: 1 },
    recife: { descricao: "🥤 Caldo de cana - leve 2 pague 1", tipo: "leve2pague1", itemId: 4 },
    saopaulo: { descricao: "💳 Compre uma Carne do Sol e ganhe 50 pontos extras!", tipo: "pontosdobrados", itemId: 2 }
};
