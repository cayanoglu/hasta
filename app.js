// Global state
let allContacts = [];
let filteredContacts = [];
let currentPage = 1;
const contactsPerPage = 50;

// DOM elements
const contactsBody = document.getElementById('contactsBody');
const searchInput = document.getElementById('searchInput');
const statsEl = document.getElementById('stats');
const paginationEl = document.getElementById('pagination');
const loadBtn = document.getElementById('loadBtn');

// Load contacts from Excel file
async function loadContacts() {
    loadBtn.textContent = '⏳ Yükleniyor...';
    loadBtn.disabled = true;

    try {
        // Fetch the Excel file
        const response = await fetch('data/contacts.json');
        if (!response.ok) {
            throw new Error('Veri dosyası bulunamadı');
        }
        allContacts = await response.json();
        
        // Apply current filter
        filterContacts();
        
        statsEl.textContent = `Toplam ${allContacts.length} hasta | Gösterilen: ${filteredContacts.length}`;
    } catch (error) {
        console.error('Load error:', error);
        statsEl.textContent = '❌ Veri yüklenemedi: ' + error.message;
        contactsBody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:40px; color:#e74c3c;">
            Veri yüklenemedi. <code>data/contacts.json</code> dosyasının var olduğundan emin olun.
        </td></tr>`;
    } finally {
        loadBtn.textContent = '🔄 Verileri Yenile';
        loadBtn.disabled = false;
    }
}

// Filter contacts based on search input
function filterContacts() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        filteredContacts = [...allContacts];
    } else {
        filteredContacts = allContacts.filter(c => 
            c.name.toLowerCase().includes(query) ||
            c.phone.includes(query) ||
            c.tc.includes(query) ||
            c.address.toLowerCase().includes(query) ||
            c.doctor.toLowerCase().includes(query)
        );
    }
    
    currentPage = 1;
    renderContacts();
    renderPagination();
    statsEl.textContent = `Toplam ${allContacts.length} hasta | Gösterilen: ${filteredContacts.length}`;
}

// Render contacts table
function renderContacts() {
    const start = (currentPage - 1) * contactsPerPage;
    const end = start + contactsPerPage;
    const pageContacts = filteredContacts.slice(start, end);
    
    if (pageContacts.length === 0) {
        contactsBody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:40px; color:#7f8c8d;">
            Kayıt bulunamadı
        </td></tr>`;
        return;
    }
    
    contactsBody.innerHTML = pageContacts.map((contact, index) => `
        <tr>
            <td>${start + index + 1}</td>
            <td class="patient-name">${escapeHtml(contact.name)}</td>
            <td>${escapeHtml(contact.tc)}</td>
            <td><a href="tel:${contact.cleanPhone}" class="phone-link">${escapeHtml(contact.phone)}</a></td>
            <td title="${escapeHtml(contact.address)}">${escapeHtml(truncate(contact.address, 40))}</td>
            <td>${escapeHtml(contact.date)}</td>
            <td title="${escapeHtml(contact.procedure)}">${escapeHtml(truncate(contact.procedure, 30))}</td>
            <td>${escapeHtml(contact.doctor)}</td>
            <td>${escapeHtml(contact.institution)}</td>
            <td>${escapeHtml(contact.gender)}</td>
            <td>${contact.age}</td>
            <td>
                <a href="https://wa.me/${contact.cleanPhone}" target="_blank" class="whatsapp-btn">
                    💬 WhatsApp
                </a>
            </td>
        </tr>
    `).join('');
}

// Render pagination controls
function renderPagination() {
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
    
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">‹ Önceki</button>`;
    
    // Page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    // Next button
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Sonraki ›</button>`;
    
    paginationEl.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderContacts();
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Export contacts as JSON
function exportContacts() {
    const dataStr = JSON.stringify(filteredContacts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hastalar-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Utility functions
function escapeHtml(text) {
    if (!text) return '-';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncate(str, len) {
    if (!str) return '-';
    return str.length > len ? str.substring(0, len) + '...' : str;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', loadContacts);