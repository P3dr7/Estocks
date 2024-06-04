function validarForm(event) {
	event.preventDefault();

	var email = document.getElementById("floatingInputEmail").value;
	var senha = document.getElementById("floatingInputSenha").value;

	const dados = {
		email: email,
		senha: senha,
	};
	console.log(dados);
	try {
		fetch("http://127.0.0.1:3333/verificaLogin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(dados),
		})
			.then((response) => response.json())
			.then((data) => {
				// Atualiza a variável dadosRecebidos com os dados do backend
				dadosRecebidos = data;
				console.log("Dados do backend:", dadosRecebidos);

				// Continua com o restante do código, se necessário
				if (dadosRecebidos.auth) {
					// Redirecione para outra página
					window.location.href = "produtos.html";
				} else if (!dadosRecebidos.auth) {
					// Exiba um aviso de que os dados são divergentes
					alert(
						"Os dados são divergentes. Por favor, verifique suas credenciais."
					);
				} else {
					throw new Error("Erro na solicitação da API");
				}
			});
	} catch (error) {
		console.error("Erro ao enviar dados para a API:", error);
		// Manipule o erro de maneira apropriada (exibir mensagem para o usuário, etc.)
	}
}

document.getElementById("produtoForm").addEventListener("submit", enviaProduto);

async function enviaProduto(event) {
		event.preventDefault(); // Impede o envio padrão do formulário

	const nomeProduto = document.getElementById("floatingNomeProduto").value;
	const tamanhoProduto = document.getElementById(
		"floatingTamanhoProduto"
	).value;
	const corProduto = document.getElementById("floatingCorProduto").value;
	const precoProduto = document.getElementById("floatingPrecoProduto").value;
	const quantidadeProduto = document.getElementById(
		"floatingQuantidadeProduto"
	).value;

	const dados = {
		tamanho: tamanhoProduto,
		cor: corProduto,
		precoProduto,
		quantidadeProduto,
		nomeProduto,
		// tamanho, cor, precoProduto, quantidadeProduto, nomeProduto
	};

	console.log("Dados a serem enviados:", JSON.stringify(dados));

	try {
		const response = await fetch("http://127.0.0.1:3333/inserirProduto", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(dados),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		// console.log("Dados do backend:", data);

		if (data.produto) {
			alert("Produto Inserido Com Sucesso");
		} else if (!data.produto) {
			alert("Produto Não foi Inserido.");
		} else {
			throw new Error("Erro na solicitação da API");
		}
	} catch (error) {
		console.error("Erro ao enviar dados para a API:", error);
	}
}
