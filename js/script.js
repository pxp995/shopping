window.onload=function(){
	var cartTable=document.getElementById('cartTable');
	var tr=cartTable.getElementsByTagName('tr');
	//var tr=cartTable.children[1].rows;//获取cartTable标签下第二个子节点下的所有行（rows）这种方法为表格特有的方法
	var checkInput=document.getElementsByClassName('check');
	var checkAllInput=document.getElementsByClassName('check-all');
	var selectedTotal=document.getElementById('selectedTotal');
	var priceTotal=document.getElementById('priceTotal');
	var selected=document.getElementById('selected');
	var foot=document.getElementById('foot');
	var selectedViewList=document.getElementById('selectedViewList');
	var deleteAll=document.getElementById('deleteAll');
	
	
	
	//计算函数，包括总数量和总价格的计算
	function getTotal(){
		var selected=0;
		var price=0;
		var htmlstr='';
		for(var i=1,len=tr.length;i<len;i++){
			if(tr[i].getElementsByTagName('input')[0].checked){
				tr[i].className='on';
				selected+=parseInt(tr[i].getElementsByTagName('input')[1].value);
				price+=parseFloat(tr[i].getElementsByTagName('td')[4].innerHTML);
				//price+=parseFloat(tr[i].cells[4].innerHTML);//表格特有的属性获取第n个元素（cell）等价于上一句
				
				//在计算同时把下面的商品弹出层显示出来
				htmlstr+='<div><img src="'+ tr[i].getElementsByTagName('img')[0].src+'"><span index="'+i+'" class="del">取消选择</span></div>';
			}else{
				tr[i].className='';
			}
		}
		
		selectedTotal.innerHTML=selected;
		priceTotal.innerHTML=price.toFixed(2);
		selectedViewList.innerHTML=htmlstr;
	}
	
	
	//点击加减号价格变化函数
	function getSubTotal(tr){
		var tds=tr.getElementsByTagName('td');
		var price=parseFloat(tds[2].innerHTML);
		var count=parseInt(tr.getElementsByTagName('input')[1].value);
		var subTotal=parseFloat(price*count);
		tds[4].innerHTML=subTotal;
	}
	
	//遍历所有的单选框，点击时触发相应的事件
	for(var i=0,len=checkInput.length;i<len;i++){
		checkInput[i].onclick=function(){
			if(this.className=='check-one check'){
				//优化
				this.parentNode.parentNode.getElementsByTagName('input')[1].value='1';
				getSubTotal(this.parentNode.parentNode);
			}		
			if(this.className=='check-all check'){
				for(var j=0,l=checkInput.length;j<l;j++){
					checkInput[j].checked=this.checked;
				}
				for(var j=1,l=checkInput.length-1;j<l;j++){
					checkInput[j].parentNode.parentNode.getElementsByTagName('input')[1].value='1';
					getSubTotal(checkInput[j].parentNode.parentNode);
				}
				if(!this.checked){
					for(var j=1,l=checkInput.length-1;j<l;j++){
						checkInput[j].parentNode.parentNode.getElementsByTagName('input')[1].value='0';
						getSubTotal(checkInput[j].parentNode.parentNode);
						getTotal();
					}
				}
			}
			
			if(this.checked==false){
				this.parentNode.parentNode.getElementsByTagName('input')[1].value='0';
				getSubTotal(this.parentNode.parentNode);
				for(var k=0,L=checkAllInput.length;k<L;k++){
					checkAllInput[k].checked=false;
				}
			}
			getTotal();
			//解决了通过复选框取消商品选择时的弹框显示问题
			if(selectedTotal.innerHTML==0){
				foot.className='foot';
			}
		}
	}
	
	//点击弹出浮层
	selected.onclick=function(){
		if(foot.className=='foot'){
			if(selectedTotal.innerHTML!=0){
				foot.className+=' show';
			}
			
		}else{
			foot.className='foot';
		}		
	}
	//点击取消选择去掉图片，由于span标签是动态生成的所以不能直接添加点击事件，要通过事件代理的方法添加。
	//点击一个元素时，给元素父元素的点击事件添加一个e参数（事件对象）；这个参数的srcElement属性可以返回点击的具体元素（可通过console.log打印出来看看）
	selectedViewList.onclick=function(e){
		//console.log(e);
		var el=e.srcElement;
		if(el.className=='del'){//在此区分是否点击了span标签（以class为区别）
			var index=el.getAttribute('index');
			var input=tr[index].getElementsByTagName('input')[0];
			input.checked=false;
			input.onclick();
			//解决了通过取消选择按钮取消商品选择时的弹框显示问题
			if(selectedTotal.innerHTML==0){
				foot.className='foot';
			}
		}
	}
	//点击加减号进行数量的变化
	for(var i=0,l=tr.length;i<l;i++){
		tr[i].onclick=function(e){
			var el=e.srcElement;
			var cls=el.className;
			var input=this.getElementsByTagName('input')[1];
			var input1=this.getElementsByTagName('input')[0];
			var val=parseInt(input.value);
			var reduce=this.getElementsByTagName('span')[1];
			switch(cls){
				case 'add':
					input.value=val+1;
					getSubTotal(this);
					if(val>=0){
						reduce.innerHTML='-';
						input1.checked=true;
					}
					break;
				case 'reduce':
					if(val>=1){
						input.value=val-1;
						getSubTotal(this);
						if(val<=1){
							reduce.innerHTML='';
							input1.checked=false;
						}
					}
					break;
				case 'delete':
					var cho=confirm('确定要删除吗？');
					if(cho){
						this.parentNode.removeChild(this);
					}
					break;

				default:
					break;
			}
			getTotal();
		}
		//键盘输入数字时的响应事件
		//tr[i].getElementsByTagName('input')[1].onkeyup=function(){
//			var val = parseInt(this.value);
//            if (isNaN(val) || val <= 0) {
//                val = 1;
//            }
//            if (this.value != val) {
//                this.value = val;
//            }
//            getSubtotal(this.parentNode.parentNode); //更新小计
//            getTotal(); //更新总数
//		}
				
		
		//删除全部功能
		deleteAll.onclick=function(){
			if(selectedTotal.innerHTML!=0){
				var cho=confirm('确定要删除吗？');
				if(cho){
					for(var i=0,l=tr.length;i<l;i++){
						var input=tr[i].getElementsByTagName('input')[0];
						if(input.checked){
							tr[i].parentNode.removeChild(tr[i]);
							i--;//因为会生成新的数组，所以i的位置会向前移一位，因此要--；
						}
					}
				}
			}		
		}
	}
	//默认全选中
	checkAllInput[0].checked=true;
	checkAllInput[0].onclick();
}















