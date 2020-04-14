new Vue({
    el:'.wrap',
    data:{
        todos:[],
        input:{
           newTitle:'',
           newDate:'',
           newTime:'',
           newComment:'',
           file:'',
           isCompleted:false,
           isStar:false,
           isEdit:false
        }, 
        newFile:null,
        editTodo:false,
        visibility:'all',
        todoLen: 0
    },
    methods: {
        addTodo(){           
            let value = this.input.newTitle;
            if(!value){
                alert('請輸入內容');
                return;
            }
            fetch('https://fathomless-brushlands-42339.herokuapp.com/todo1/',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.input)
            })
            .then((res)=> res.text())
            .then(data => { 
                this.todos.push(JSON.parse(data)) 
            })
            .catch(err => console.log('error is', err));         
            //清除輸入框
            this.cancelTodo();
            //關閉編輯欄
            this.editTodo = false  
        },
        cancelTodo(){
            this.input.newTitle = ''; 
            this.input.newDate = '';
            this.input.newTime = '';
            this.input.file = '';
            this.input.newComment = '';
        },
        fileSelected(e){
            let input = e.target;
            if (input.files) {
                let reader = new FileReader();
                reader.addEventListener('load',this.loaded); //執行loaded函式
                this.input.file = input.files[0];
                reader.readAsDataURL(this.input.file);
            }
        }, 
        loaded(e){
            this.newFile = e.target.result;
        },
        completeChange(item){
            item.isCompleted = !item.isCompleted;
            fetch('https://fathomless-brushlands-42339.herokuapp.com/todo1/'+item.id,{
                method:'PATCH',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({"isCompleted": item.isCompleted})
            })
            .then((res)=> res.text())
            .catch(err => console.log('error is',err));
            this.todoLenChange()             
        },
        starChange(item){
            item.isStar = !item.isStar;
            fetch('https://fathomless-brushlands-42339.herokuapp.com/todo1/'+item.id,{
                method:'PATCH',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({"isStar": item.isStar})
            })
            .then((res)=> res.text())
            // .then(data => {console.log(data)})
            .catch(err => console.log('error is',err));
        },
        items(visibility){
            let arr =[];            
            if(visibility == 'all'){
                arr = this.todos;
            }else if(visibility == 'progress'){
                arr = this.todos.filter(data => !data.isCompleted);
            }else if(visibility == 'completed'){
                arr = this.todos.filter(data => data.isCompleted);
            }
            return arr;
        },
        editChange(item){
            // console.log(item) 
            fetch('https://fathomless-brushlands-42339.herokuapp.com/todo1/'+item.id,{
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(item)
            })
            .then((res)=> res.json())
            // .then(data => { console.log(data)})
            .catch(err => console.log('error is', err));
            //關閉編輯欄
            item.itemEdit = false    
        },
        todoLenChange() {
            this.todoLen = 0;
            //先指定completed再跑this.todos的迴圈
            if(this.visibility =='completed') {
                this.todos.forEach(data => {
                    if (data.isCompleted) {
                        this.todoLen++
                    }
                })
            } else {
                this.todos.forEach(data => {
                    if (!data.isCompleted) {
                        this.todoLen++
                    }
                })
            }     
        }
    },
    mounted() {
        fetch('https://fathomless-brushlands-42339.herokuapp.com/todo1/')
        .then(res => res.json())
        .then(todos => {
            todos.forEach(data => {
                data.itemEdit = false //為了添上鉛筆編輯的布林狀態
                if (!data.isCompleted) {
                    this.todoLen++
                }
            }) 
            this.todos = todos
        })
        .catch((err) => {
            console.log('error is', err);
        })        
    },
    watch: {
        visibility(){
            this.todoLenChange();
        }
    },
});
