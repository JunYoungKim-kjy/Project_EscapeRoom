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
  init(){
    this.$openBtn.classList.remove("hide")
  }

    //아이템 사용
  useItem(events, overlay){
    this.inventory.addEventListener("click",e=>{
      const dataName = e.target.getAttribute("data-name");
      if(!dataName)return;
      const activeitem = this.activeItem(e.target);
      if(activeitem==='paper'){
        events.actionEvent(events.$openPaper , overlay);
      }
    });
  }
      
  //슬롯으로 가져오기
  moveToSlotItem(target){
    // const targetElement = target.parentElement;
    if(!target.getAttribute("data-name"))return;
    this.getItem(target);
    const name = target.getAttribute("data-name");
    return name;
  }
  getItem(item){
    const slotList = [...document.querySelectorAll(".slot")];
    const slot = slotList.find(e=>e.innerHTML=='');
    slot.appendChild(item);
    item.classList.remove("hint")
  }

  //액티브 지우기
  removeActive(){
    const itemArr = [...document.querySelectorAll(".slot>.item")]
    itemArr.forEach(e=>{
      e.classList.remove("active")
    })
  }

  //액티브 붙이기
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