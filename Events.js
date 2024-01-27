export default class Events{
    constructor(ctx,light){
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
        this.$Xbtn = document.querySelector(".Xbtn")          //X버튼
        this.light = light;
        this.level = 0;
        this.eventObj = {
            firstKey : null,
            paper : this.$openPaper,
            hammer : null,
        }


        this.isRainbow = false;
        this.isOpenBox = false;
        this.init();
    }
    // 보물상자
    // 상자 열기 및 종이 획득
    boxEvent(overlay, Inventory){
        this.$box.addEventListener("click",e=>{
            if(this.level>=4){
                alert("얼른 나가자")
                return;
            }
            if(!this.light)return;
            if(this.isOpenBox){
            this.actionEvent(this.$inBox, overlay);
            this.$inBox.addEventListener("click",e=>{
                Inventory.moveToSlotItem(e.target);
            });
            if(this.level < 3){
                this.level = 3;
                return true; 
            }
            }else{
                if(Inventory.activeitem != 'firstKey'){
                    alert("열 수 있을거 같은데?")
                    return;
                }else{
                    alert("열렸다!")
                    this.isOpenBox = true;
                };
            };
        });
    }

    

    // 책장 열기
    bookShelfEvent(overlay){
        this.$bookshelf.addEventListener("click",()=>{
            if(!this.light)return;
            if(this.level < 3){
                alert("주변에 힌트가 있을거 같은데..");
                return;
            }
            this.actionEvent(this.$inBookshelf,overlay);
        });
    }
    // 책장문제
    inBookShelfEvent(items){
        // 책문제
        this.$setion1.addEventListener("drop",e=>{
        if(this.isRainbow)return;
        e.preventDefault();
        const afterElement = this.getDragAfterElement(this.$setion1,e.clientX);
        const draggable = document.querySelector(".dragging");
        if (afterElement === undefined){
            this.$setion1.appendChild(draggable);
        }else{
            this.$setion1.insertBefore(draggable,afterElement);
        }
        // 정답 확인
        const bookArr = [...this.$setion1.children];
        let num = 0;
        // some == 1개라도 ture 면 ture값 반환
        // every == 1개라도 false이면 false값 반환 (전체가 true여야 true 반환);
        
        if(bookArr.every(book=>{
            if(book.getAttribute("data-num") == num++){
                return true;
            }
        })){
        this.isRainbow = true;
          //열쇠 떨어트리기
        items.$lastKey.classList.add("show");
        setTimeout(()=>{
            alert("달그락")},300)
        }
    });
    }

    // 라스트 도어
    lastDoorEvent(overlay){
        this.$lastDoor.addEventListener("click",()=>{
        this.actionEvent(this.$doorLock,overlay);
        })

    }
    // X버튼 클릭시 event종료
    xButtunEvent(Inventory, overlay){
        this.$Xbtn.addEventListener("click",e=>{
            this.closeEvent();
            Inventory.removeActive();
            this.$Xbtn.classList.remove('on');
            overlay.classList.remove('on');
        });
    }
        
    // 이벤트열기
    actionEvent(event,overlay){
        //if(this.level.level>=4){
        //   alert("얼른 나가자")
        //   return;
        //}
        const events = [...this.$events.children];
        if(events.find(e=>{
            const classArr = [...e.classList];
            if(classArr.find(c=>c=="action")){
                return e;
            }
        }
            ))return;
        if(!this.light)return;
        overlay.classList.add("on");
        event.classList.add("action");
        this.$Xbtn.classList.add('on');
    }

    //도어락 설정
    doorLockEvent(Inventory ,isObj){
        // checkDoorLock
        this.$doorLock.addEventListener("click",()=>{
            if(isObj['finish'])return;
            if(Inventory.activeitem === "lastKey"){
                this.$lastDoor.style.zIndex = '-10';
                this.$doorLock.classList.add("active")
                this.$Exit.style.zIndex = 10;

                alert("덜컥");
                isObj['finish']=true;
                return true;
            }else{
                alert("열 수 있어보인다.");
                return false;
            }
        });
    }

    init(){


    // gameOver
    this.$Exit.addEventListener("click",()=>{
        alert("탈출")
    });

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