export default class Events{
    constructor(Inventory ,ctx, isObj){
        this.$events = document.querySelector(".events");       //이벤트 오브젝트 부모 객체
        this.$Lightswitch = document.querySelector("#switch");  //전등스위치
        this.$box = document.querySelector(".box");
        this.$bookshelf = document.querySelector(".bookshelf");
        this.$inBookshelf = document.querySelector(".inBookshelf");
        this.$lastDoor = document.querySelector(".door");
        this.$doorLock = document.querySelector(".doorLock");
        this.$inBox = document.querySelector(".inBox");
        this.$openPaper = document.querySelector(".openPaper");
        this.$setion1 = document.querySelector(".setion1");
        this.$Exit = document.querySelector(".Exit");


        this.isRainbow = false;
        this.isOpenBox = false;
        this.init();
    }
    init(){
    

    // 책 세팅
        const bookArr = [...this.$setion1.children];
        bookArr.forEach(book=>{
            const color = book.getAttribute("data-id");
            book.classList.add("draggable")
            book.setAttribute("draggable","true");
            book.style.backgroundColor = color;

            // 드래그 시작시 클래스 추가
            book.addEventListener("dragstart",()=>{
                book.classList.add("dragging");
            });
            // 드래그 종료시 클래스 삭제
            book.addEventListener("dragend",()=>{
                book.classList.remove("dragging");
            });
        });

        this.$setion1.addEventListener("dragover",e=>{
            e.preventDefault();
        });

    }
    

    getDragAfterElement(setion,x){
        const draggableElements = [...this.$setion1.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
        (closest, child) =>{
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if(offset < 0 && offset > closest.offset){
                return { offset: offset, element:child};
            }else{
                return closest;
            }
        },{ offset : Number.NEGATIVE_INFINITY },
    ).element;

    }

    
    closeEvent(){
        const list = [...document.querySelector(".events").children];
        list.forEach(e=>{
            e.classList.remove("action");
        })
    }


    
}