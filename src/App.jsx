import { useState, useEffect } from "react";
import "./App.css";

export default function JogoDaCobrinha() {
  const [celulas, setCelulas] = useState(Array(100).fill(0));
  const [posicaoCobra, setPosicaoCobra] = useState(44);
  const [direcao, setDirecao] = useState("direita");
  const [posicaoComida, setPosicaoComida] = useState(() =>
    Math.floor(Math.random() * 100),
  );
  const [corpoCobra, setCorpoCobra] = useState([44, 43, 42]);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [aceleracao, setAceleracao] = useState(0);

  function reiniciarJogo() {
    setPosicaoCobra(44);
    setDirecao("direita");
    setCorpoCobra([44, 43, 42]);
    setPosicaoComida(gerarPosicaoComida([44, 43, 42]));
    setJogoFinalizado(false);
    setPontuacao(0);
    setAceleracao(0);
  }

  useEffect(() => {
    if (jogoFinalizado) return;
    function controlarTeclado(event) {
      if (event.key === "ArrowUp") {
        const permitido = mudarDirecao("cima");

        if (permitido) {
          andarCima();
        }
      } else if (event.key === "ArrowDown") {
        const permitido = mudarDirecao("baixo");

        if (permitido) {
          andarBaixo();
        }
      } else if (event.key === "ArrowRight") {
        const permitido = mudarDirecao("direita");

        if (permitido) {
          andarDireita();
        }
      } else if (event.key === "ArrowLeft") {
        const permitido = mudarDirecao("esquerda");

        if (permitido) {
          andarEsquerda();
        }
      }
    }
    window.addEventListener("keydown", controlarTeclado);

    return () => {
      window.removeEventListener("keydown", controlarTeclado);
    };
  }, [
    direcao,
    posicaoCobra,
    corpoCobra,
    posicaoComida,
    jogoFinalizado,
    pontuacao,
    aceleracao,
  ]);

  useEffect(() => {
    const velocidadeCalculada = 1000 - aceleracao;
    const velocidade = Math.max(100, velocidadeCalculada);
    console.log(velocidade);
    const intervalo = setInterval(() => {
      if (jogoFinalizado) {
        return;
      }

      if (direcao === "direita") {
        andarDireita();
      } else if (direcao === "esquerda") {
        andarEsquerda();
      } else if (direcao === "cima") {
        andarCima();
      } else {
        andarBaixo();
      }
    }, velocidade);

    return () => {
      clearInterval(intervalo);
    };
  }, [direcao, posicaoCobra, jogoFinalizado, aceleracao]);

  function mudarDirecao(novaDirecao) {
    if (direcao === "direita" && novaDirecao === "esquerda") {
      return false;
    } else if (direcao === "esquerda" && novaDirecao === "direita") {
      return false;
    } else if (direcao === "cima" && novaDirecao === "baixo") {
      return false;
    } else if (direcao === "baixo" && novaDirecao === "cima") {
      return false;
    }

    setDirecao(novaDirecao);
    return true;
  }

  function gerarPosicaoComida(cobraAtual = corpoCobra) {
    let novaPosicao;

    do {
      novaPosicao = Math.floor(Math.random() * 100);
    } while (cobraAtual.includes(novaPosicao));
    console.log("nova Posicao-comida-nova", novaPosicao);

    return novaPosicao;
  }

  function verificarComida(posicaoNova) {
    if (posicaoNova === posicaoComida) {
      setPosicaoComida(gerarPosicaoComida([posicaoNova, ...corpoCobra]));
      console.log("Nova posição da cabeça:", posicaoNova);
      console.log("Posição da comida antiga:", posicaoComida);
      setPontuacao((anterior) => anterior + 10);
      if (aceleracao < 900) {
        setAceleracao((anterior) => anterior + pontuacao + 20);
      }
      return true;
    }

    return false;
  }

  function moverCobra(novaCabeca) {
    const comeu = verificarComida(novaCabeca);
    console.log("comeu?", comeu);
    const bateuNoCorpo =
      corpoCobra.includes(novaCabeca) &&
      (comeu || novaCabeca !== corpoCobra[corpoCobra.length - 1]);

    if (bateuNoCorpo) {
      setJogoFinalizado(true);
      return false;
    }

    console.log("nova cabeça:", novaCabeca);
    console.log("bateu no corpo?", bateuNoCorpo);
    console.log("calda atual:", corpoCobra[corpoCobra.length - 1]);
    console.log("posição já ocupada?", corpoCobra.includes(novaCabeca));

    let novaCobra = [novaCabeca, ...corpoCobra];

    console.log("Cobra antes de remover a cauda:", novaCobra);

    if (!comeu) {
      novaCobra = novaCobra.slice(0, -1);
    }
    console.log("Cobra depois de remover a cauda:", novaCobra);
    setCorpoCobra(novaCobra);
    return true;
  }

  function andarEsquerda() {
    let posicaoNova = posicaoCobra - 1;

    if (posicaoCobra % 10 === 0) {
      posicaoNova = posicaoNova + 10;
    }

    const movimentoPermitido = moverCobra(posicaoNova);

    if (movimentoPermitido) {
      setPosicaoCobra(posicaoNova);
    }
  }

  function andarDireita() {
    let posicaoNova = posicaoCobra + 1;

    if (posicaoNova % 10 === 0) {
      posicaoNova = posicaoNova - 10;
    }

    const movimentoPermitido = moverCobra(posicaoNova);

    if (movimentoPermitido) {
      setPosicaoCobra(posicaoNova);
    }
    // console.log("Posição atual:", posicaoCobra);
  }

  function andarCima() {
    let posicaoNova = posicaoCobra - 10;

    if (Math.floor(posicaoNova / 10) === -1) {
      posicaoNova = posicaoNova + 100;
    }

    const movimentoPermitido = moverCobra(posicaoNova);

    if (movimentoPermitido) {
      setPosicaoCobra(posicaoNova);
    }
  }

  function andarBaixo() {
    let posicaoNova = posicaoCobra + 10;

    if (Math.floor(posicaoNova / 10) === 10) {
      // aqui dentro, precisamos corrigir a posição
      posicaoNova = posicaoNova - 100;
    }

    const movimentoPermitido = moverCobra(posicaoNova);

    if (movimentoPermitido) {
      setPosicaoCobra(posicaoNova);
    }
  }

  function controlarMovimento(novaDirecao) {
    const permitido = mudarDirecao(novaDirecao);

    if (permitido) {
      if (novaDirecao === "cima") {
        andarCima();
      } else if (novaDirecao === "baixo") {
        andarBaixo();
      } else if (novaDirecao === "direita") {
        andarDireita();
      } else if (novaDirecao === "esquerda") {
        andarEsquerda();
      }
    }
  }

  return (
    <div className="containerPai">
      {jogoFinalizado && (
        <div className="msgJogoFinalizado">
          <h3>Fim de Jogo</h3>
          <p>Você bateu no proprio corpo</p>
          <button className="reiniciar" onClick={reiniciarJogo}>
            Jogar novamente
          </button>
        </div>
      )}
      <div className="areaCelulas">
        {celulas.map((celula, indice) => {
          return (
            <div
              key={indice}
              className={
                indice === corpoCobra[0]
                  ? "celulas inicio"
                  : corpoCobra.includes(indice)
                    ? "celulas corpo"
                    : indice === posicaoComida
                      ? "celulas comida"
                      : "celulas"
              }
            ></div>
          );
        })}
      </div>
      <div className="painel-de-controle">
        <div className="pontuacao">Pontuação: {pontuacao}</div>{" "}
        <div className="controles">
          <button
            className="esquerda controle"
            onClick={() => controlarMovimento("esquerda")}
          >
            ←
          </button>
          <button
            className="direita controle"
            onClick={() => controlarMovimento("direita")}
          >
            →
          </button>
          <button
            className="cima controle"
            onClick={() => controlarMovimento("cima")}
          >
            ↑
          </button>
          <button
            className="baixo controle"
            onClick={() => controlarMovimento("baixo")}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
