# GrubDash
API project for Thinkful.

API built following RESTful design principles for a mock food delivery service website.

Mock Front-End for this API can be found in [this repository](https://github.com/smiauek/starter-grub-dash-front-end.git)

## Supported Routes:
- `GET /dishes`  
This route will respond with a list of all existing dish data.
- `POST /dishes`  
This route will save the dish and respond with the newly created dish.
- `GET /dishes/:dishId`  
This route will respond with the dish where `id === :dishId` or return `404` if no matching dish is found.
- `PUT /dishes/:dishId`  
This route will update the dish where `id === :dishId` or return `404` if no matching dish is found.
- `GET /orders`  
This route will respond with a list of all existing order data.
- `POST /orders`  
This route will save the order and respond with the newly created order.
- `GET /orders/:orderId`  
This route will respond with the order where `id === :orderId` or return `404` if no matching order is found.
- `PUT /orders/:orderId`  
This route will update the order where `id === :orderId`, or return `404` if no matching order is found.
- `DELETE /orders/:orderId`  
This route will delete the order where `id === :orderId`, or return `404` if no matching order is found.

## Tech:
This app is utilizing:
- Node.js
- Express.js

