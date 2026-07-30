document.addEventListener('DOMContentLoaded', () => {

  /* 1. Scroll Reveal Animation */
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);
  
  revealElements.forEach(el => revealObserver.observe(el));

  /* 2. Accordion Logic */
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach(acc => {
    const header = acc.querySelector('.accordion-header');
    const content = acc.querySelector('.accordion-content');
    
    header.addEventListener('click', () => {
      const isOpen = acc.classList.contains('open');
      
      // Close all other accordions (optional, but good for saving space)
      accordions.forEach(otherAcc => {
        otherAcc.classList.remove('open');
        otherAcc.querySelector('.accordion-content').style.maxHeight = null;
      });

      if (!isOpen) {
        acc.classList.add('open');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // Open first accordion by default
  if(accordions.length > 0){
    accordions[0].classList.add('open');
    const firstContent = accordions[0].querySelector('.accordion-content');
    firstContent.style.maxHeight = firstContent.scrollHeight + "px";
  }

  /* 3. Countdown Timer */
  // Target: 16 Agustus 2026 07:00:00 WIB
  const targetDate = new Date("Aug 16, 2026 07:00:00").getTime();
  
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if(elDays) elDays.innerText = "00";
      if(elHours) elHours.innerText = "00";
      if(elMins) elMins.innerText = "00";
      if(elSecs) elSecs.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if(elDays) elDays.innerText = days.toString().padStart(2, '0');
    if(elHours) elHours.innerText = hours.toString().padStart(2, '0');
    if(elMins) elMins.innerText = minutes.toString().padStart(2, '0');
    if(elSecs) elSecs.innerText = seconds.toString().padStart(2, '0');
  };
  
  if(elDays) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* 4. Copy to Clipboard */
  const btnCopy = document.getElementById('btn-copy');
  const rekeningText = "087735072392";
  
  if(btnCopy) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(rekeningText).then(() => {
        const originalText = btnCopy.innerHTML;
        btnCopy.innerHTML = "✅ Tersalin!";
        btnCopy.style.background = "rgba(46, 213, 115, 0.4)";
        setTimeout(() => {
          btnCopy.innerHTML = originalText;
          btnCopy.style.background = "";
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  }

  /* 5. Lightbox for QR Code */
  const qrBox = document.querySelector('.qr-box');
  if(qrBox) {
    const qrImgSrc = qrBox.querySelector('img').src;
    
    // Create Lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `<img src="${qrImgSrc}" alt="QR DANA">`;
    document.body.appendChild(lightbox);
    
    qrBox.addEventListener('click', () => {
      lightbox.classList.add('active');
    });
    
    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  /* 6. Active Nav Link on Scroll */
  const sections = document.querySelectorAll('section.card');
  const navLinks = document.querySelectorAll('.navbar a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  /* 7. Live Progress Data */
  const progressContainer = document.getElementById('progress-container');
  const progressSummary = document.getElementById('progress-summary');
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSVQVLRFv4nq5W8X43-VMg-R3gnQdZ3POonXTqRQvk58n60YZVBkduXbXwgBUxxbZn-hae4wqKso88a/pub?gid=982283584&single=true&output=csv";

  if (progressContainer) {
    fetch(csvUrl)
      .then(response => response.text())
      .then(csvText => {
        // Remove BOM if present
        csvText = csvText.replace(/^\uFEFF/, '');
        
        // Parse CSV
        const rows = csvText.split('\n').map(row => {
          row = row.replace(/\r$/, '');
          let result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < row.length; i++) {
            let char = row[i];
            if (char === '"' && row[i+1] === '"') {
              current += '"';
              i++;
            } else if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current);
          return result;
        }).filter(row => row && row.length >= 1 && row[0]);

        // Cari baris header yang mengandung 'Nama'
        let headerIndex = -1;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i][0] && rows[i][0].trim().toLowerCase() === 'nama') {
            headerIndex = i;
            break;
          }
        }

        if (headerIndex === -1 || headerIndex === rows.length - 1) {
          progressContainer.innerHTML = '<p style="text-align:center; color:var(--abu);">Belum ada data.</p>';
          return;
        }

        const dataRows = rows.slice(headerIndex + 1);
        let totalTerkumpul = 0;
        let totalLunas = 0;
        let totalWarga = 0;
        let html = '';
        
        let wargaList = [];

        dataRows.forEach(row => {
          // Data Lunas (Kolom 0 dan Kolom 1)
          if (row[0] && row[0].trim() !== '') {
            const namaLunas = row[0].trim();
            const lunasRaw = row[1] ? row[1].trim() : '';
            let amountStr = lunasRaw.replace(/[^0-9]/g, '');
            let amount = parseInt(amountStr, 10);
            
            if (!isNaN(amount) && amount > 0) {
              totalTerkumpul += amount;
            }
            
            wargaList.push({
              nama: namaLunas,
              isLunas: true,
              detail: lunasRaw || 'Lunas'
            });
            totalLunas++;
            totalWarga++;
          }
          
          // Data Belum Lunas (Kolom 2)
          if (row[2] && row[2].trim() !== '') {
            const namaBelumLunas = row[2].trim();
            wargaList.push({
              nama: namaBelumLunas,
              isLunas: false,
              detail: 'Belum Lunas' // atau bisa dikosongkan/ditulis lain jika ada kolom keterangan
            });
            totalWarga++;
          }
        });
        
        wargaList.forEach(warga => {
          const statusClass = warga.isLunas ? 'status-lunas' : 'status-belum';
          const statusText = warga.isLunas ? 'Lunas' : 'Belum Lunas';

          html += `
            <div class="progress-card">
              <div class="pc-header">
                <div class="pc-nama">${warga.nama}</div>
                <div class="pc-status ${statusClass}">${statusText}</div>
              </div>
              <div class="pc-body">
                <div class="pc-detail">${warga.detail}</div>
              </div>
            </div>
          `;
        });

        const percentage = totalWarga > 0 ? Math.round((totalLunas / totalWarga) * 100) : 0;
        let summaryHtml = `
          <div class="summary-stats">
            <div class="stat-box">
              <div class="stat-value">${totalLunas} / ${totalWarga}</div>
              <div class="stat-label">Warga Lunas</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">Rp ${totalTerkumpul.toLocaleString('id-ID')}</div>
              <div class="stat-label">Total Terkumpul</div>
            </div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="progress-bar-text">${percentage}% Selesai</div>
        `;
        
        progressSummary.innerHTML = summaryHtml;
        progressContainer.innerHTML = html;
      })
      .catch(err => {
        console.error("Error fetching data: ", err);
        progressContainer.innerHTML = '<p style="text-align:center; color:red; grid-column:1/-1;">Gagal memuat data live.</p>';
      });
  }

});
