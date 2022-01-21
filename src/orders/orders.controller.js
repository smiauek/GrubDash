const path = require("path");

const orders = require(path.resolve("src/data/orders-data"));

const nextId = require("../utils/nextId");

function bodyDataHas(propertyName) {
    return function(req, res, next) {
        const {data = {}} = req.body;
        if(data[propertyName]) {
            return next();
        }
        next({status: 400, message: `Order must include a ${propertyName}`});
    };
};

function validateDishes(req, res, next) {
    const {data: {dishes} = {}} = req.body;

    if(!dishes) {
        return next({
            status: 400,
            message: "Order must include a dish"
        });
    };

    if(!Array.isArray(dishes) || dishes.length < 1) {
        return next({
            status: 400,
            message: "Order must include at least one dish"
        });
    };

    next();
};

function orderExists(req, res, next) {
    const {orderId} = req.params;

    const foundOrder = orders.find((order) => order.id == orderId);

    if(foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }

    next({
        status: 404,
        message: `Order does not exist: ${orderId}`
    });
};

function validateDishQuantity(req, res, next) {
    const {data: {dishes} = {}} = req.body;

    for (let i=0; i<dishes.length; i++) {
        if(!dishes[i].quantity || dishes[i].quantity < 1 || !Number.isInteger(dishes[i].quantity)) {
            return next ({
                status: 400,
                message: `Dish ${i} must have a quantity that is an integer greater than 0`
            });
        };
    };

    next();
};

function idInBodyMatchesRouteId(req, res, next) {
    const routeId = req.params.orderId;
    const idInBody = req.body.data.id;

    if(idInBody) {
        if(idInBody === routeId) {
            return next()
        };
        return next({
            status: 400,
            message: `Order id does not match route id. Order: ${idInBody}, Route: ${routeId}`
        });
    };
    next();
};

function validateStatus(req, res, next) {
    const {data: {status} = {}} = req.body;
    const validStatus = ["pending", "preparing", "out-for-delivery"];

    if(status === "delivered") {
        return next({
            status: 400,
            message: "A delivered order cannot be changed"
        });
    };

    if(!validStatus.includes(status)) {
        return next({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
        });
    };

    next();
};

function validatePending(req, res, next) {

    if(res.locals.order.status !== "pending") {
        return next({
        status: 400,
        message: "An order cannot be deleted unless it is pending"
     });
    };

    next();   
};

function create(req, res, next) {
    const {data: {deliverTo, mobileNumber, status, dishes} = {}} = req.body;

    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status,
        dishes
    };

    orders.push(newOrder);
    res.status(201).json({data: newOrder});
};

function read(req, res, next) {
    res.json({data: res.locals.order});
};

function update(req, res, next) {
    const order = res.locals.order;
    const {data: {deliverTo, mobileNumber, status, dishes} = {}} = req.body;

    order.deliverTo = deliverTo,
    order.mobileNumber = mobileNumber,
    order.status = status,
    order.dishes = dishes,

    res.json({data: order});
};

function destroy(req, res, next) {
    const index = orders.findIndex((order) => res.locals.order.id == order.id);

    const deletedOrder = orders.splice(index, 1);

    res.sendStatus(204);
}

function list(req, res, next) {
    res.json({data: orders});
};

module.exports = {
    create: [
        validateDishes,
        validateDishQuantity,
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        create,
    ],
    read: [
        orderExists,
        read,
    ],
    update: [
        orderExists,
        validateStatus,
        idInBodyMatchesRouteId,
        validateDishes,
        validateDishQuantity,
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        update,
    ],
    destroy: [
        orderExists,
        validatePending,
        destroy
    ],
    list
};