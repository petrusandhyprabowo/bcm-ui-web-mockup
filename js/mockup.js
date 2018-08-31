//var baseUrl = 'https://tamanaws.herokuapp.com/';
var baseUrl = 'http://0.0.0.0:11111/';

$(document).ready(function(){
	$('body .contentbar').on('click', 'tbody tr', function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');
			$(this).find('input[type="checkbox"]')[0].checked = false;
		} else {
			$(this).addClass('selected');
			$(this).find('input[type="checkbox"]')[0].checked = true;
		};
		if($('.button-sidebar.aktif').attr('data-html') != 'pembelian'){
			checkChecked();
		}
	});

	$('.popup').on('click', '#btn-add-pembelian', function(){
		var formDataSave = new FormData($('.popup .popup-content form')[0]);
		var object = {};
		var objects = [];
		var param = {};
		formDataSave.forEach(function(value, key){
		    object[key] = value;
		});
		objects[0] = object;
		var jsonData = JSON.stringify(objects);
		param['url'] = baseUrl + 'pembelian/savepembelian';
		param['jsondata'] = jsonData;
		ajaxPost(param);
		urlTable = 'pembelian/getviewtablepembelian?uid=' + object['uid_transaction'];
		generateTableData(urlTable, '.popup-content');
	});

	$('.btn-topbar').on('click',function(){
		var btnText = $(this).text();
		var dataHtml = $('.button-sidebar.aktif').text();
		$('.popup #popup-title').text(btnText + ' ' + dataHtml);
		var param;
		if ('transaction' == $('.button-sidebar.aktif').attr('data-html')) {
			param = {'url': 'html/content/pembelian.html'};
		} else {
			param = {'url': 'html/form/' + $('.button-sidebar.aktif').attr('data-html') + '.html'};
		}
		htmlScript = ajaxGetHtml(param);
		$('.popup .popup-content').html(htmlScript);
		$('.background-popup').addClass('show');
		$('.popup').addClass('show');
		$('.popup .popup-content form').attr('data-event', $(this).attr('data-event'));
		if ('transaction' == $('.button-sidebar.aktif').attr('data-html')) {
			if ('save' == $(this).attr('data-event')) {
				var params = {};
				params['url'] = baseUrl + 'transaction/generatetransaction';
				params['jsondata'] = '';
				var uid = ajaxPost(params);
				$('.popup .popup-content form input[name="uid_transaction"]').val(uid.uid);
				urlTable = 'pembelian/getviewtablepembelian?uid=' + uid.uid;
				generateTableData(urlTable, '.popup-content');
			} else {
				var checkedUid = $('body .contentbar input[type="checkbox"]:checked');
				$('.popup .popup-content form input[name="uid_transaction"]').val(checkedUid[0].value);
				$('.popup .popup-content form input[name="member_name"]').val($('body .contentbar tr.selected td')[1].textContent);
				urlTable = 'pembelian/getviewtablepembelian?uid=' + checkedUid[0].value;
				generateTableData(urlTable, '.popup-content');
			}
		} else {
			if ('edit' == $(this).attr('data-event')) {
				var value = {};
				var trth = $('.contentbar thead th');
				var trtds = $('.contentbar tbody tr.selected td');
				console.log('trth',trth);
				console.log('trtds',trtds);
				for (var i = 0; i < trth.length; i++) {
					var editVal = $('.popup .popup-content form input[name="' + trth[i].attributes['data-colname'].value + '"]');
					console.log('trtds',trtds);
					if (editVal.length != 0) {
						if (editVal[0].localName == 'input') {
							editVal.val(trtds[i].textContent);
						} else if (editVal[0].localName == 'select') {
							editVal.find('option').each(function(){
								if ($(this)[0].text == trtds[i].textContent) {
									$(this).attr('selected','selected');
								}
							});
						}
					}
				}
			}
		}
	});

	$('.btn-topbar-delete').on('click',function(){
		$('.background-popup').addClass('show');
		$('.popup-delete').addClass('show');
		$('.popup-delete .btn-del-OK').attr('data-event', $(this).attr('data-event'));
	});

	$('.btn-topbar-close').on('click',function(){
		$('.popup-close input').val(0);
		$('.background-popup').addClass('show');
		$('.popup-close').addClass('show');
		$('.popup-close .btn-close-OK').attr('data-event', $(this).attr('data-event'));
		$('.popup-close input[name="total_payment"]').val($('.contentbar tbody tr.selected td')[5].textContent);
	});

	$('.btn-del-OK').on('click',function(){
		var checkedUid = $('body .contentbar input[type="checkbox"]:checked');
		var objects = [];
		var param = {};
		for (var i = 0; i < checkedUid.length; i++) {
			var object = {};
			object['uid'] = checkedUid[i].value;
			objects[i] = object;
		}
		var jsonData = JSON.stringify(objects);
		param['url'] = baseUrl + $('.button-sidebar.aktif').attr('data-event-url') + $(this).attr('data-event') + $('.button-sidebar.aktif').attr('data-html');
		param['jsondata'] = jsonData;
		console.log(jsonData)
		ajaxPost(param);
		urlTable = $('.button-sidebar.aktif').attr('data-table-url');
		generateTableData(urlTable, '.contentbar');
		$('.background-popup').removeClass('show');
		$('.popup-delete').removeClass('show');
		checkChecked();
	});

	$('.btn-close-OK').on('click',function(){
		var checkedUid = $('body .contentbar input[type="checkbox"]:checked');
		var objects = [];
		var param = {};
		for (var i = 0; i < checkedUid.length; i++) {
			var object = {};
			object['uid'] = checkedUid[i].value;
			objects[i] = object;
		}
		var jsonData = JSON.stringify(objects);
		param['url'] = baseUrl + $('.button-sidebar.aktif').attr('data-event-url') + 'closetransaction';
		param['jsondata'] = jsonData;
		console.log(jsonData)
		ajaxPost(param);
		urlTable = $('.button-sidebar.aktif').attr('data-table-url');
		generateTableData(urlTable, '.contentbar');
		$('.background-popup').removeClass('show');
		$('.popup-close').removeClass('show');
		checkChecked();
	});

	$('.btn-del-cancel').on('click',function(){
		$('.background-popup').removeClass('show');
		$('.popup-delete').removeClass('show');
	});

	$('.btn-close-cancel').on('click',function(){
		$('.background-popup').removeClass('show');
		$('.popup-close').removeClass('show');
	});

	$('.background-popup').on('click',function(){
		$('.background-popup').removeClass('show');
		$('.popup').removeClass('show');
		$('.popup-delete').removeClass('show');
	});

	$('.popup .btn-save').on('click',function(){
		if ('transaction' != $('.button-sidebar.aktif').attr('data-html')) {
			var formDataSave = new FormData($('.popup .popup-content form')[0]);
			var object = {};
			var objects = [];
			var param = {};
			if ($('.popup-content form').attr('data-event') == 'edit') {
				object['uid'] = $('body .contentbar input[type="checkbox"]:checked')[0].value;
			}
			formDataSave.forEach(function(value, key){
			    object[key] = value;
			});
			objects[0] = object;
			var jsonData = JSON.stringify(objects);
			param['url'] = baseUrl + $('.button-sidebar.aktif').attr('data-event-url') + $('.popup-content form').attr('data-event') + $('.button-sidebar.aktif').attr('data-html');
			param['jsondata'] = jsonData;
			ajaxPost(param);
		} else if ('transaction' == $('.button-sidebar.aktif').attr('data-html')) {
			if ('save' == $('.popup-content form').attr('data-event')) {
				var jsonData = {};
				var param = {};
				jsonData['transaction_id'] = $('.popup input[name="uid_transaction"').val();
				jsonData['member_name'] = $('.popup input[name="member_name"').val();
				param['url'] = baseUrl + $('.button-sidebar.aktif').attr('data-event-url') + 'saveusertransaction';
				param['jsondata'] = JSON.stringify(jsonData);
				ajaxPost(param);
			}
		}
		$('.background-popup').removeClass('show');
		$('.popup').removeClass('show');
		urlTable = $('.button-sidebar.aktif').attr('data-table-url');
		generateTableData(urlTable, '.contentbar');
		checkChecked();
	});

	$('.button-sidebar').on('click',function(){
		/* fungsi dibawah ini untuk nge-load file html yang berisi table dimasukkan
			ke dalam contenbar */
		htmlFileName = $(this).attr('data-html');
		url = $(this).attr('data-table-url');
		$('.contentbar').load('html/content/' + htmlFileName + '.html');
		//$('.contentbar').attr('w3-include-html', 'html/content/' + $(this).attr('data-html') + '.html')
		// !mportant -- generateTableData(url, '.contentbar');
		$('.button-sidebar').removeClass('aktif');
		$(this).addClass('aktif');
		$('.topbar span').replaceWith('<span class="title-topbar">' + $(this)[0].textContent + '</span>');
		if (htmlFileName == 'pembelian') {
			$('#btn-topbar-add').attr('disabled','disabled');
		} else {
			$('#btn-topbar-add').removeAttr('disabled');
		}
		//w3IncludeHTML();
	});

	$('.popup-close input[name="money"]').on('keyup', function(){
		console.log($(this).val());
		$('.popup-close input[name="change"]').val($(this).val() - $('.popup-close input[name="total_payment"]').val());
	});

	function checkChecked(){
		var lnChecked = $('body .contentbar input[type="checkbox"]:checked').length;
		var isTransaction = $('.button-sidebar.aktif').attr('data-html') == 'transaction';
		if (lnChecked == 1) {
			if (isTransaction) {
				$('#btn-topbar-close').removeAttr('disabled');
				$('#btn-topbar-edit').removeAttr('disabled');
			} else {
				$('#btn-topbar-edit').removeAttr('disabled');
				$('#btn-topbar-delete').removeAttr('disabled');
			}
		} else if (lnChecked > 1) {
			if (isTransaction) {
				$('#btn-topbar-close').attr('disabled','disabled');
				$('#btn-topbar-edit').attr('disabled','disabled');
			} else {
				$('#btn-topbar-edit').attr('disabled','disabled');
				$('#btn-topbar-delete').removeAttr('disabled');
			}
		} else {
			if (isTransaction) {
				$('#btn-topbar-close').attr('disabled','disabled');
				$('#btn-topbar-edit').attr('disabled','disabled');
			} else {
				$('#btn-topbar-edit').attr('disabled','disabled');
				$('#btn-topbar-delete').attr('disabled','disabled');	
			}
		}
	}

	function generateTableData(url, element){
		param = {'url': baseUrl + url}
		dataTable = ajaxGet(param);
		colNames = $(element + ' table th');
		tableName = $(element + ' table').attr('name');
		$(element + ' tbody').html('')
		for (var i = 0; i < dataTable.length; i++) {
			stringTd = ""
			for (var j = 0; j < colNames.length; j++) {
				if (j != (colNames.length - 1)) {
					stringTd += '<td>' + dataTable[i][colNames[j].attributes['data-colname'].value] + '</td>'
				} else {
					stringTd += '<td style="display: none"><input type="checkbox" name="' + tableName + 'check' + i + '" value="' + dataTable[i][colNames[j].attributes['data-colname'].value] + '"></td>';
				}
			}
			$(element + ' tbody').append('<tr>' + stringTd + '</tr>');
		}
	}

	function ajaxGetHtml(param){
		var responseGet;
		$.ajax({
			method: 'GET',
			async: false,
			url: param.url,
			success: function(response){
				responseGet =  response;
			},
			error: function(){
				alert('error')
			}
		});
		return responseGet;
	}

	function ajaxGet(param){
		var responseGet;
		$.ajax({
			method: 'GET',
			async: false,
			url: param.url,
			success: function(response){
				responseGet =  response.data;
			},
			error: function(){
				alert('error')
			}
		});
		return responseGet;
	}

	function ajaxPost(param){
		var responsePost;
		if ('' == param.jsondata) {
			$.ajax({
				headers: {'Content-Type':'application/json'},
				method: 'POST',
				async: false,
				url: param.url,
				success: function(response){
					responsePost = response.data;
				},
				error: function(){
					alert('error')
				}
			});
		} else {
			$.ajax({
				headers: {'Content-Type':'application/json'},
				method: 'POST',
				data: param.jsondata,
				async: false,
				url: param.url,
				success: function(response){
					responsePost = response.data;
				},
				error: function(){
					alert('error')
				}
			});
		}
		return responsePost;
	}

	var htmlFileName = 'application';
	$('.contentbar').load('html/content/' + htmlFileName + '.html');
});

function getOptionDataForSelectElement(url, keyUid, keyValue, tagAttrName){
	$.ajax({
		method: 'GET',
		async: false,
		url: baseUrl + url,
		success: function(response){
			responseGet =  response.data;
			for (var i = 0; i < responseGet.length; i++) {
				$('.popup-content form select[name="' + tagAttrName + '"]').append('<option value="' + responseGet[i][keyUid] + '">' + responseGet[i][keyValue] + '</option>');
			}
		},
		error: function(){
			alert('error')
		}
	});
}