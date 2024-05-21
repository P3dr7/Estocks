function validarForm(event) {
	event.preventDefault();

	var email = document.getElementById("floatingInputEmail").value;
	var senha = document.getElementById("floatingInputSenha").value;

	const dados = {
		email: email,
		senha: senha,
	};
    console.log(dados)
	try {
		fetch("http://127.0.0.1:3333/verificaLogin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(dados),
		})
		.then(response => response.json())
		.then(data => {
			// Atualiza a variável dadosRecebidos com os dados do backend
			dadosRecebidos = data;
			console.log('Dados do backend:', dadosRecebidos);

			// Continua com o restante do código, se necessário
			if (dadosRecebidos.auth) {
				// Redirecione para outra página
				window.location.href = "cargos.html";
			} else if (!dadosRecebidos.auth) {
				// Exiba um aviso de que os dados são divergentes
				alert("Os dados são divergentes. Por favor, verifique suas credenciais.");
			} else {
				throw new Error("Erro na solicitação da API");
			}
		});
	} catch (error) {
		console.error("Erro ao enviar dados para a API:", error);
		// Manipule o erro de maneira apropriada (exibir mensagem para o usuário, etc.)
	}
}