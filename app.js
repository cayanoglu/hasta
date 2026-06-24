const MSG = `*Merhaba efendim,*

Ben *Op.Dr. Cüneyt Ayanoğlu*

Bu mesaj Özel *Vera Tıp Merkezi*, *Kulak Burun Boğaz Hastalıkları Polikliniğimizde*
almış olduğunuz muayene hizmeti ile ilgili olarak gönderilmiştir.

Tedaviniz ile ilgili önemli olabilecek konular için https://ent.ist/fo adresini ziyaret edebilirsiniz.

Tedavi sürecindeki sormak istediğiniz konular ile ilgili veya tedavi sonucu tam iyileşme olmadı ise bu konuyu değerlendirmek için benimle *Whatsapp* üzerinden
istediğiniz vakitte *irtibata geçebilirsiniz*.

Almış olduğunuz hizmetler ile ilgili düşüncelerinizi *google profilime* yorum olarak
yazarsanız memnun olurum. Bunun için https://ent.ist/rev
adresini ziyaret ediniz.

*Op. Dr. Cüneyt Ayanoğlu*
*Kulak Burun Boğaz* Hastalıkları Uzmanı
Özel Vera Tıp Merkezi
Sefaköy / Küçükçekmece`;

function renderPreview() {
  document.getElementById('msgPreview').innerHTML = MSG
    .replace(/\*([^*]+)\*/g,'<b>$1</b>')
    .replace(/_([^_]+)_/g,'<i>$1</i>')
    .replace(/\n/g,'<br>');
}

const encoded = encodeURI(MSG);

async function loadContacts() {
  const res = await fetch('data/contacts.json');
  const all = await res.json();
  renderCards(all);
  document.getElementById('subtitle').textContent = `${all.length} hasta`;
  document.getElementById('msgSummary').textContent = `${all.length} hasta için`;
}

function renderCards(hastalar) {
  const cards = document.getElementById('cards');
  cards.innerHTML = '';
  for (let i = 0; i < hastalar.length; i++) {
    const h = hastalar[i];
    const card = document.createElement('a');
    card.className = 'card';
    card.href = 'whatsapp://send?phone=' + h.cleanPhone + '&text=' + encoded;
    card.title = formatPhone(h.cleanPhone);

    const num = document.createElement('div');
    num.className = 'num';
    num.textContent = i + 1;

    const info = document.createElement('div');
    const visitInfo = h.visit_count > 1 ? ` (${h.visit_count} ziyaret)` : '';
    info.innerHTML = '<div class="name">' + h.name + '</div>' +
      '<div class="date">' + h.last_date + visitInfo + ' · ' + h.age + ' yaş</div>' +
      '<div class="diag">' + h.diagnosis + '</div>';

    const wa = document.createElement('div');
    wa.className = 'wa';
    wa.textContent = '💬';

    card.appendChild(num);
    card.appendChild(info);
    card.appendChild(wa);
    cards.appendChild(card);
  }
}

function formatPhone(p) {
  return p.replace(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
}

loadContacts();
renderPreview();