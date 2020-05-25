# wishlistAPI

O objetivo desse desafio é a criação de uma API de Wishlist, que permita **adicionar**, **editar**, **visualizar** e **remover** clientes e, também, **visualizar** a wishlist e **adicionar**/**remover** produtos da wishlist de cada cliente.

## Pré requisitos
- docker
- docker-compose
- git
- make

## Como utilizar

- Para utilizar a API é necessário clonar o repositório
```sh
git clone https://github.com/dudaduarte/wishlistAPI.git
```
- Entrar na pasta do projeto
```sh
cd wishlistAPI
```
- Subir a aplicação
```sh
make init
```
- Para rodar testes de integração
```sh
make test-all
```
- Derrubar a aplicação
```sh
make down
```

## Rotas
Os recursos dessa aplicação poderão ser acessados na URL `http://localhost:3030`
### Admin
Para realizar utilizar os recursos `/clients` e `/clients/:id/wishlist`, é necessário criar ou já ter previamente uma conta de usuário admin e estar autenticado.
#### POST /admin
Para criar um registro de usuário admin:
- `POST http://localhost:3030/admin`
- Body:
```json
{
  "name": "name",
  "email": "email@email.com",
  "password": "password"
}
```
Um token será disponibilizado na responsta da requisição. Esse token deverá ser usado no **header**, na chave `"authorization"`, da seguinte forma:
```
authorization: <token>
```
#### POST /admin/authenticate
Essa aplicaço utiliza autenticação JWT com tokens que expiram em 3 horas.
Caso já tenha criado um usuário admin e deseje autenticá-lo:
- `POST http://localhost:3030/admin/authenticate`
- Body:
```json
{
  "email": "email@email.com",
  "password": "password"
}
```
Um token será disponibilizado na responsta da requisição. Esse token deverá ser usado no **header**, na chave `"authorization"`, da seguinte forma:
```
authorization: <token>
```
### Clients
#### POST /clients
É necessário que sejam cadastrados clientes para que haja o acesso as suas wishlists.
Para criar um novo cliente:
- `POST http://localhost:3030/clients`
- Body:
```json
{
  "name": "name",
  "email": "email@email.com"
}
```

#### PUT /clients/:id
Para editar o cadastro de um cliente:
- `PUT http://localhost:3030/clients/:id`
- Body:
```json
{
  "name": "name",
  "email": "email@email.com"
}
```

#### GET /clients
Para visualizar todos os clientes cadastrados:
- `GET http://localhost:3030/clients`

#### GET /clients/:id
Para visualizar um cliente a partir de seu id:
- `GET http://localhost:3030/clients/:id`

#### DELETE /clients/:id
Para deletar um cliente a partir de seu id:
- `DELETE http://localhost:3030/clients/:id`

### Wishlist
Os produtos a serem adicionados, visualizados e deletados nesse recurso são os disponíveis na seguinte API:
`http://challenge-api.luizalabs.com/api/product/?page=<PAGINA>`, onde `<PAGINA>` representa o número da página que será exibida, começando em `1`.
Também é possível visualizar um produto específico a partir de seu `id` acessando `http://challenge-api.luizalabs.com/api/product/<ID>`

#### POST /clients/:id/wishlist
Para adicionar um produto à wishlist de um cliente:
```json
{
  "productId": "87fb7dcc-9572-85cb-8e9a-5ea2172bc763"
}
```

#### GET /clients/:id/wishlist
Para visualizar a wishlist de um cliente:
- `GET http://localhost:3030/clients/:id/wishlist`

#### GET /clients/:id/wishlist/:productId
Para visualizar um produto da wishlist de um cliente:
- `GET http://localhost:3030/clients/:id/wishlist/:productId`

#### DELETE /clients/:id/wishlist/:productId
Para excluir um produto da wishlist de um cliente a partir do `id` de ambos:
- `DELETE http://localhost:3030/clients/:id/wishlist/:productId`

