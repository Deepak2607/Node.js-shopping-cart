module.exports=function Cart(oldCart){
    this.items= oldCart.items || {};
    this.totalQty= oldCart.totalQty || 0;
    this.totalPrice= oldCart.totalPrice || 0;
    this.itemsArray= oldCart.itemsArray || [];
    
    this.add= function(item, id){
        let storedItem= this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price= storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };
    
    this.add2= function(cart){
      
        for(let id1 in cart.items){
            let count=0;
            for(let id2 in this.items){
                if(id1===id2){
                    count++;
                }
            }
            if(count!==0){
                let item= cart.items[id1];
                let storedItem= this.items[id1];
                
                storedItem.qty += item.qty;
                storedItem.price= storedItem.item.price * storedItem.qty;
                this.totalQty += item.qty;
                this.totalPrice += storedItem.item.price * item.qty;
            }else{
                let item= cart.items[id1];
                this.items[id1] = {item: item.item, qty: item.qty, price: item.item.price * item.qty};
                this.totalQty += item.qty;
                this.totalPrice += item.item.price * item.qty;
            }
        }
    }
    
    this.generateArray= () =>{
        var arr= [];
        for(let id in this.items){
            arr.push(this.items[id]);
        }
        this.itemsArray= arr;
    };
}

