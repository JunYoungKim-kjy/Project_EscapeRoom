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

    //아이템 사용
    useItem(events, overlay){
      this.inventory.addEventListener("click",e=>{
        // if(e.target.parentElement.getAttribute("data-id") === 'btn')return;
        const dataName = e.target.parentElement.getAttribute("data-name");
        if(!dataName)return;
        const activeitem = this.activeItem(e.target.parentElement);
        if(activeitem==='paper'){
          events.actionEvent(events.overlay,overlay);
        }
      });
    }
      
  //슬롯으로 가져오기
  moveToSlotItem(target){
    const targetElement = target.parentElement;
    if(!targetElement.getAttribute("data-name"))return;
    this.getItem(targetElement);
    const name = targetElement.getAttribute("data-name");
    return name;
  }
  getItem(item){
    const slotList = [...document.querySelectorAll(".slot")];
    const slot = slotList.find(e=>e.innerHTML=='');
    slot.appendChild(item);
    item.classList.remove("hint")
  }

  //액션 지우기
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