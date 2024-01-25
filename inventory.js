export default class Inventory{
  constructor(){
    this.inventory = document.querySelector(".inventory");
    this.slotList = document.querySelector(".slotList");
    this.$openBtn = document.querySelector(".openbtn");
    this.activeitem = null;
    this.openInventory = false;
    
    this.$openBtn.addEventListener("click",()=>{
      if(this.openInventory){
        this.$openBtn.classList.add("down");
        this.inventory.classList.add("down");
        this.openInventory = !this.openInventory;
      }else{
        this.$openBtn.classList.remove("down");
        this.inventory.classList.remove("down");
        this.openInventory = !this.openInventory;

      }
    })
  }

  getItem(item){
    const slotList = [...document.querySelectorAll(".slot")];
    const slot = slotList.find(e=>e.innerHTML=='');
    slot.appendChild(item);
  }

  activeItem(item){
    const itemArr = [...document.querySelectorAll(".slot>.item")]
    const classList=[...item.classList]

    if(classList.find(e=>e=="active")){
        item.classList.remove("active");
        this.activeitem = null;
    }else{
      itemArr.forEach(e=>{
        e.classList.remove("active")
      })
      item.classList.add("active");
      this.activeitem = item.getAttribute("data-name");
    }
    return this.activeitem;
  }
}