const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

  // find all categories
  router.get('/', async (req, res) => {
    try{
      const categoryData = await Category.findAll({
        include: [{model: Product}]
      });
      res.status(200).json(categoryData);
    }catch(err){
      res.status(500).json(err);
    }
  });

  router.get('/:id', async (req, res) => {
    try{
      const categoryData = await Category.findByPk(req.params.id, {
        include: [{model: Product}]
      });
      if (!categoryData){
        res.status(404).json({message: 'No category found with this id'});
        return;
      }
      res.status(200).json(categoryData);
    }catch (err){
      res.status(500).json(err);
    }
  });

//Creating a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async(req, res) => {
  try{
    const [updatedRows] = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if(updatedRows===0){
      res.status(404).json({message: 'No category found with this id'});
      return;
    }
    const updateCategory = await Category.findByPk(req.params.id);
    res.status(200).json(updateCategory);
  }catch (err){
    res.status(400).json(err);
  }
});

//Destroying a category by it's ID
router.delete('/:id', async (req, res) => {
  try{
    const deletedRows = await Category.destroy({
      where:{
        id: req.params.id
      }
    });
    if(deletedRows===0){
      res.status(404).json({message: 'No category found with this id'});
      return;
    }
    res.status(200).json({message: 'Category deleted succesfully'});
  }catch (err){
    res.status(500).json(err);
  }

});

module.exports = router;
