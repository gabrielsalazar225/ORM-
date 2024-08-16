const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

//Getting all products including product category and it's tag
router.get('/', async(req, res) => {
  try{
    const productData = await Product.findAll({
      include: [
        {model: Category},
        {model: Tag}
      ]
    });
    res.json(productData);
  }catch (err){
    res.status(500).json(err);
  }

});

// Getting a product by it's ID
router.get('/:id', async(req, res) => {
  try{
    const productData = await Product.findByPk(req.params.id, {
      include: [
        {model: Category},
        {model: Tag}
      ]
    });
    if(!productData){
      res.status(404).json({message: 'Not product found with this id'});
      return
    }
    res.status(200).json(productData);

  }catch(err){
    res.status(500).json(err)
  }
});

//Creating a new product
router.post('/', async(req, res) => {
try{
  const productData = await Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
  });
  if (req.body.tagIds && req.body.tagIds.length){
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return{
        product_id: productData.id,
        tag_id,
      };
    });
    await ProductTag.bulkCreate(productTagIdArr);
  }
  
  res.status(200).json(productData);
}catch(err){
  console.log(err);
  res.status(400).json(err);
}
});
  

// Update product by it's ID, (implemented async await to follow how I made the other routes and for better readablity)

router.put('/:id', async(req, res) => {
try{
  //Update product data
  const [updatedRows] = await Product.update(req.body, {
    where: {id: req.params.id},
  });
  if(updatedRows===0){
    return res.status(404).json({message: 'No product found with this id'});
  }
  //Finding existing ProductTags
  if(req.body.tagIds && req.body.tagIds.length){
    const productTags = await ProductTag.findAll({
      where: {product_id: req.params.id}
    });
    //Getting a list of the current tag_ids
    const productTagIds = productTags.map(({tag_id})=> tag_id);
    //Creating a filtered list of the tag_ids
    const newProductTags = req.body.tagIds.filter((tag_id)=>!productTagIds.includes(tag_id)).map((tag_id)=>{
      return{
        product_id: req.params.id,
        tag_id,
      };
    });
    //Figuring which one will be removed
    const productTagsToRemove = productTags.filter(({tag_id})=>!req.body.tagIds.includes(tag_id)).map(({id})=>id);
    await Promise.all([
      ProductTag.destroy({where: {id: productTagsToRemove}}),
      ProductTag.bulkCreate(newProductTags),
    ]);
  }
  //Getting the updated product
  const updatedProduct = await Product.findByPk(req.params.id,{
    include: [{model: Tag, through: ProductTag}]
  });
  res.json(updatedProduct);
}catch(err){
  console.log(err);
  res.status(404).json(err);
}
  
});
//Destroy a product by it's ID
router.delete('/:id', async(req, res) => {
  try{
    const deletedRows = await Product.destroy({
      where:{
        id: req.params.id
      }
    });
    if(deletedRows===0){
      res.status(404).json({message: 'No product found with this id'});
      return;
    }
    res.status(200).json({message: 'Product deleted succesfully'});
  }catch (err){
    res.status(500).json(err);
  }

});

module.exports = router;