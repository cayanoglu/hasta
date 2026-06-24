// Mesaj taslağı (markdown dosyasından birebir)
var MSG = "*Merhaba efendim,*\n\nBen *Op.Dr. Cüneyt Ayanoğlu*\n\nBu mesaj Özel *Vera Tıp Merkezi*, *Kulak Burun Boğaz Hastalıkları Polikliniğimizde*\nalmış olduğunuz muayene hizmeti ile ilgili olarak gönderilmiştir.\n\nTedaviniz ile ilgili önemli olabilecek konular için https://ent.ist/fo adresini ziyaret edebilirsiniz.\n\nTedavi sürecindeki sormak istediğiniz konular ile ilgili veya tedavi sonucu tam iyileşme olmadı ise bu konuyu değerlendirmek için benimle *Whatsapp* üzerinden\nistediğiniz vakitte *irtibata geçebilirsiniz*.\n\nAlmış olduğunuz hizmetler ile ilgili düşüncelerinizi *google profilime* yorum olarak\nyazarsanız memnun olurum. Bunun için https://ent.ist/rev\nadresini ziyaret ediniz.\n\n*Op. Dr. Cüneyt Ayanoğlu*\n*Kulak Burun Boğaz* Hastalıkları Uzmanı\nÖzel Vera Tıp Merkezi\nSefaköy / Küçükçekmece";

// encodeURI kullan (encodeURIComponent DEĞİL - virgülü %2C yapıyor, markup bozuluyor)
var encoded = encodeURI(MSG);

// Preview render - *bold* ve _italic_ → <b> <i>
document.getElementById('msgPreview').innerHTML = MSG
  .replace(/\*([^*]+)\*/g, '<b>$1</b>')
  .replace(/_([^_]+)_/g, '<i>$1</i>')
  .replace(/\n/g, '<br>');

// Hasta verilerini JSON'dan yükle
async function loadHastalar() {
  try {
    const response = await fetch('data/contacts.json');
    if (!response.ok) throw new Error('Veri yüklenemedi');
    const contacts = await response.json();
    
    // Subtitle güncelle
    document.getElementById('subtitle').textContent = contacts.length + ' kayıt';
    
    renderCards(contacts);
  } catch (e) {
    document.getElementById('subtitle').textContent = 'Hata: ' + e.message;
    console.error(e);
  }
}

function renderCards(hastalar) {
  var cards = document.getElementById('cards');
  cards.innerHTML = '';
  
  for (var i = 0; i < hastalar.length; i++) {
    var h = hastalar[i];
    
    // whatsapp:// protokolü (iOS + Android çalışıyor)
    var waLink = 'whatsapp://send?phone=' + h.cleanPhone + '&text=' + encoded;
    
    var a = document.createElement('a');
    a.className = 'wa';
    a.href = waLink;
    a.textContent = '💬';
    a.title = h.phone;
    
    var num = document.createElement('div');
    num.className = 'num';
    num.textContent = i + 1;
    
    var info = document.createElement('div');
    info.innerHTML = '<div class="name">' + escapeHtml(h.name) + '</div><div class="date">' + h.date + '</div>';
    
    var card = document.createElement('div');
    card.className = 'card';
    card.appendChild(num);
    card.appendChild(info);
    card.appendChild(a);
    cards.appendChild(card);
  }
}

function escapeHtml(text) {
  if (!text) return '-';
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Başlat
document.addEventListener('DOMContentLoaded', loadHastalar);