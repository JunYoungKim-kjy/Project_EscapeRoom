export default class Inventory{
  constructor(){
    this.inventory = document.querySelector(".inventory");
    this.itemList = document.querySelector(".itemlist")

  }

  getItem(item){
    const itemArr = [...this.itemList.children];
    const slot = itemArr.find(e=>e.innerHTML=='');
    slot.appendChild(item);
  };

  useItem(item){
    
  }
}