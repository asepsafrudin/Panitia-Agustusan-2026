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

});
