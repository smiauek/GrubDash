const path = require("path");

const dishes = require(path.resolve("src/data/dishes-data"));

const nextId = require("../utils/nextId");

function dishExists(req, res, next) {
    const {dishId} = req.params;

    const foundDish = dishes.find((dish) => dish.id == dishId);

    if(foundDish) {
        res.locals.dish = foundDish;
        return next();
    }

    next({
        status: 404,
        message: `Dish does not exist: ${dishId}`
    });
};

function bodyDataHas(propertyName) {
    return function(req, res, next) {
        const {data = {}} = req.body;
        if(data[propertyName]) {
            return next();
        }
        next({status: 400, message: `Dish must include a ${propertyName}`});
    };
};

function priceIsValidNumber(req, res, next) {
    const {data: {price} ={}} = req.body;
    if(price <= 0 || !Number.isInteger(price)) {
        return next({
            status: 400,
            message: "Dish must have a price that is an integer greater than 0"
        });   
    };
    next();
};

function idInBodyMatchesRouteId(req, res, next) {
    const routeId = req.params.dishId;
    const idInBody = req.body.data.id;

    if(idInBody) {
        if(idInBody === routeId) {
            return next()
        };
        return next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${idInBody}, Route: ${routeId}`
        });
    };
    next();
};

function create(req, res, next) {
    const {data: {name, description, price, image_url} = {}} = req.body;

    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    };

    dishes.push(newDish);
    res.status(201).json({data: newDish});
};

function read(req, res, next) {
    res.json({data: res.locals.dish});
};

function update(req, res, next) {
    const dish = res.locals.dish;
    const {data: {name, description, price, image_url} = {}} = req.body;

    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;

    res.json({data: dish});
};

function list(req, res, next) {
    res.json({ data: dishes})
}


module.exports = {
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        priceIsValidNumber,
        create
    ],
    read: [
        dishExists,
        read,
    ],
    update: [
        dishExists,
        idInBodyMatchesRouteId,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        priceIsValidNumber,
        update,
    ],
    list,
}
