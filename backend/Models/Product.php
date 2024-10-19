<?php
class Product{
    private $name
    private $category
    private $price
    //constructior
    public function product_constructor($name, $category, $price) {
        $this->name = $name;
        $this->category = $category;
        $this->price = $price;
    }
    //Getters
    public function getName(){
        return $this->name;
    }
    public function getPrice(){
        return $this->price 
    }
    public function getCategory(){
        return $this->category
    }
    //Setters
    public function setName($name) {
        $this->name = $name;
    }
    public function setPrice($price) {
        $this->price = $price;
    }
    public function setCategory($categroy) {
        $this->category = $category;
    }
}