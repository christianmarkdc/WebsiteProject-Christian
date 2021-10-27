$(document).ready(function(){
	loadItems();
	addMoney();
	purchaseItem();
});

function loadItems(){
	clearItems();
	var count =1;
	var num =1;
	var vendingMachine=$('#vendingMachine');
	$.ajax({
		type:'GET',
		url:'http://vending.us-east-1.elasticbeanstalk.com/items',
		success: function(itemArray) {	
			for(i=0;i<itemArray.length;i++){
						var boxID= 'box'+count;

				var box= '<div class="col-3 border border-dark m-2 p-3 boxElement" id="'+boxID+'">';
					box +='</div>';
				/*if(count%3 ==0){
					box +='</div>';
				}*/
				vendingMachine.append(box);
				count++;
			}
			$.each(itemArray, function(index, items){
				
				var id= items.id;
				var name = items.name;
				var price = items.price;
				var quantity = items.quantity;
				
				var item ='<p>';
					item +=id+'</p>';
					item +='<div class="text-center">';
					item +='<p> '+ name+' </br>';
					item +="$"+price+' </br>'+'</br>';
					item +=' Quantity Left: '+ items.quantity;
					item +='</p>';
					item +='</div>';
				
				$("#box"+num).append(item);
				num++;
			});
		},
		error: function(){
			$('#errorMessages')
				.append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
		}
	});
}
function clearItems(){
	$('#vendingMachine').empty();
}

var runningTotal=0;
function addMoney(){
	$('#addDollar').on('click',function() {
		runningTotal += 100;
		$('#totalMoneyAmount').attr('value','$'+runningTotal/100);
	});
	$('#addQuarter').on('click',function() {
		runningTotal += 25;
		$('#totalMoneyAmount').attr('value','$'+runningTotal/100);
	});
	$('#addDime').on('click',function() {
		runningTotal += 10;
		$('#totalMoneyAmount').attr('value','$'+runningTotal/100);
	});
	$('#addNickel').on('click',function() {
		runningTotal += 5;
		$('#totalMoneyAmount').attr('value','$'+runningTotal/100);
	});
	
}

var changeTotal ='';

function purchaseItem(){
	//first press button
	var t;
	var ID;
	$(document).on('click','.boxElement',function(){
		t =$(this).attr('id');
		var itemID=$('#'+t).text();
		ID =$('#'+t+' p:first').text();
		$('#itemName').attr('value',itemID);
	});
		$('#purchaseButton').on('click',function(){
		
		if(typeof t === 'undefined'){
			$('#message').attr('value','Please Select an Item');
		}
		else{
			
			$.ajax({
				type:'POST',
				url:'http://vending.us-east-1.elasticbeanstalk.com/money/'+runningTotal/100+'/item/'+ID+'',
				//t is id runningtotal/100 is amount
				success:function(response){
					var quarterChange = response.quarters;
					var dimeChange = response.dimes;
					var nickelChange = response.nickels;
					var pennyChange = response.pennies;
					if(quarterChange != 0){
						changeTotal += quarterChange+' quarter(s)';
					}
					if(dimeChange != 0){
						if(changeTotal != ''){
							changeTotal +=', ';
						}
						changeTotal += dimeChange+' dime(s)';
					}
					if(nickelChange != 0){
						if(changeTotal != ''){
							changeTotal +=', ';
						}
						changeTotal += nickelChange+' nickel(s)';
					}
					if(pennyChange != 0){
						if(changeTotal != ''){
							changeTotal +=', ';
						}
						changeTotal += pennyChange+' penni(es)';
					}
					$('#message').attr('value','Thank you!!!');

					$('#totalChange').attr('value',changeTotal);
					$('#returnChange').on('click',function(){
						loadItems();
						runningTotal=0;
					});
					
					//return change
				},
				error:function(xhr, status, error){
					var errorMessage = xhr.responseText;
					$('#message').attr('value',errorMessage);
				}
					});
			//check running total against the price point
			//check money amount with ajax
			//give change
		}

	//if no item selected then promt message to slect item
	//purchase request is made using the money APi request using 
	//if it is sent then update the slection
	//if error then display message why
	});
}