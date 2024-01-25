export default class Events{
    constructor(){
        this.$events = document.querySelector(".events");     //이벤트 오브젝트 부모 객체
        this.$Lightswitch = document.querySelector("#switch");//전등스위치
        this.$box = document.querySelector(".box");
        this.$bookshelf = document.querySelector(".bookshelf");
        this.$lastDoor = document.querySelector(".lastDoor");
        this.$inBox = document.querySelector(".inBox");
        this.$openPaper = document.querySelector(".openPaper")

        this.isOpenBox = false;

    }
    closeEvent(){
        const list = [...document.querySelector(".events").children];
        list.forEach(e=>{
            console.log(e);
            e.classList.remove("action");
        })
    }
}