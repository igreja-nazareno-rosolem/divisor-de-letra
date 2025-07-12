# divisor-de-letra
Divisor de letras usado na projeção da igreja para deixar em um padrão a ser importado no ProPresenter.
O projeto pode ser acessado pelo seguinte link do GitHub Pages:

https://igreja-nazareno-rosolem.github.io/divisor-de-letra/

O padrão de saída é uma divisão por estrofe, separando umas das outras por uma linha vazia e em seguida os versos da estrofe são separados em pares.
A letra é transformada em upper case e copiada para a área de transferência.

Por exemplo, a seguinte letra

```
Jesus, Filho de Deus
Fernandinho

No altar de adoração seja sempre exaltado
Jesus, Filho de Deus
Deixou a Sua glória, morreu em meu lugar
Jesus, Filho de Deus

Seja exaltado, engrandecido
Seu nome é Santo, poderoso é
E não há nada que apague o Seu amor
```

tem a seguinte saída

```
Jesus, Filho de Deus - Fernandinho


NO ALTAR DE ADORAÇÃO SEJA SEMPRE EXALTADO
JESUS, FILHO DE DEUS

DEIXOU A SUA GLÓRIA, MORREU EM MEU LUGAR
JESUS, FILHO DE DEUS

SEJA EXALTADO, ENGRANDECIDO
SEU NOME É SANTO, PODEROSO É

E NÃO HÁ NADA QUE APAGUE O SEU AMOR
```


# Rodar o projeto
Necessário ter o node instalado na versão 18 ou superior.
Para rodar o projeto, use o comando:

```bash
npm run dev
```

# Testes

Necessário ter o node instalado na versão 18 ou superior.
Para rodar os testes, use o comando:

```bash
npm run test
```
