/**
 * Main Application Logic for Royal Javanese Wedding Invitation
 * Handles gate opening, countdown, guest name parsing, RSVP, copy-to-clipboard, lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. URL Query Parameter Parsing for Personalized Guest Greeting
  initGuestGreeting();

  // 2. Regol Keraton (Gate Cover) Opening Interaction
  initGateOpening();

  // 3. Countdown Timer to Dhaup Suci
  initCountdownTimer();

  // 4. Scroll Reveal Animations (IntersectionObserver)
  initScrollAnimations();

  // 5. Copy to Clipboard & Toast Notifications
  initCopyAccount();

  // 6. Add to Calendar (Google Calendar & .ics)
  initCalendarButtons();

  // 7. Interactive RSVP & Guestbook (with LocalStorage)
  initGuestbook();

  // 8. Photo Gallery Lightbox
  initGalleryLightbox();

  // 9. Bottom Navigation Dock Active Tracking
  initBottomDockNav();
});

/**
 * 1. Parse guest name from URL (?to=Nama+Tamu or ?u=Nama+Tamu)
 */
function initGuestGreeting() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('u') || urlParams.get('nama');
  
  const guestDisplayEl = document.getElementById('cover-guest-name');
  const rsvpNameInput = document.getElementById('rsvp-name');

  if (guestName && guestName.trim() !== '') {
    const cleanName = sanitizeText(guestName.trim());
    if (guestDisplayEl) {
      guestDisplayEl.textContent = cleanName;
    }
    if (rsvpNameInput) {
      rsvpNameInput.value = cleanName;
    }
  } else {
    if (guestDisplayEl) {
      guestDisplayEl.textContent = 'Bapak / Ibu / Sedherek / Sahabat';
    }
  }
}

/**
 * 2. Gate Opening Interaction
 */
function initGateOpening() {
  const gateCover = document.getElementById('gate-cover');
  const openBtn = document.getElementById('btn-open-invitation');

  if (!gateCover || !openBtn) return;

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Open Gate Animation
    gateCover.classList.add('opened');
    document.body.classList.remove('locked');

    // Start Audio
    if (window.weddingAudio && typeof window.weddingAudio.play === 'function') {
      window.weddingAudio.play();
    }

    // Gentle scroll to hero banner
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      setTimeout(() => {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }
  });
}

/**
 * 3. Countdown Timer (Target: 17 October 2026, 08:00 WIB)
 */
function initCountdownTimer() {
  // Default Target Date: 17 Oktober 2026, 08:00 WIB (Waktu Indonesia Barat = UTC+7)
  const targetDate = new Date('2026-10-17T08:00:00+07:00').getTime();

  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 4. Intersection Observer for Scroll Animations
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-item');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 5. Copy Bank Account to Clipboard & Toast
 */
function initCopyAccount() {
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetNumber = btn.getAttribute('data-account');
      if (!targetNumber) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(targetNumber).then(() => {
          showToast('Nomer rekening kasil kasalin! (Berhasil disalin)');
        }).catch(() => {
          fallbackCopyText(targetNumber);
        });
      } else {
        fallbackCopyText(targetNumber);
      }
    });
  });
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('Nomer rekening kasil kasalin! (Berhasil disalin)');
  } catch (err) {
    showToast('Gagal nyalin nomer rekening.');
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * 6. Add to Calendar (Google Calendar & .ics)
 */
function initCalendarButtons() {
  const gcalBtn = document.getElementById('btn-add-gcal');
  const icsBtn = document.getElementById('btn-download-ics');

  const eventDetails = {
    title: 'Dhaup Suci Example & Example (Pawiwahan Ageng)',
    description: 'Pahargyan Temanten Adat Ngayogyakarta Hadiningrat: Example Putri & Example Putra.',
    location: 'Bangsal Pagelaran & Pendopo Agung Kagungan Dalem Keraton Ngayogyakarta Hadiningrat',
    start: '20261017T080000',
    end: '20261017T140000'
  };

  if (gcalBtn) {
    gcalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
      window.open(gcalUrl, '_blank');
    });
  }

  if (icsBtn) {
    icsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Example & Example Wedding//ID',
        'BEGIN:VEVENT',
        `SUMMARY:${eventDetails.title}`,
        `DESCRIPTION:${eventDetails.description}`,
        `LOCATION:${eventDetails.location}`,
        `DTSTART:${eventDetails.start}`,
        `DTEND:${eventDetails.end}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Dhaup-Suci-Example.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

/**
 * 7. Interactive RSVP & Guestbook
 */
const INITIAL_WISHES = [
  {
    name: 'G.B.P.H. Prabukusumo & Kulawarga',
    status: 'attending',
    statusLabel: 'Kula Badhe Rawuh (Hadir)',
    text: 'Ndherek mangayubagya awit dhaup sucinipun Mbak Example kaliyan Mas Example. Mugi tansah pinaringan berkah dalem Gusti Kang Maha Agung, dados kulawarga ingkang sakinah, mawaddah, warahmah, rukun hayu widada.',
    time: '2 jam kepengker'
  },
  {
    name: 'Bpk. Prof. Dr. Soedharmono & Ibu',
    status: 'attending',
    statusLabel: 'Kula Badhe Rawuh (Hadir)',
    text: 'Sugeng ambal warsa paseduluran ingkang suci. Ndherek bingah lan memuji dhumateng Gusti mugi lampahing pawiwahan lumampah rancag widada nir ing sambekala.',
    time: '4 jam kepengker'
  },
  {
    name: 'Keluarga Besar Trah Mangkubumen',
    status: 'attending',
    statusLabel: 'Kula Badhe Rawuh (Hadir)',
    text: 'Ndherek mangayubagya pawiwahan ageng. Mugi Gusti Allah paring berkah kabagyan dhumateng penganten kekalih ngantos kaken-kaken lan ninen-ninen.',
    time: 'Kemawon wingi'
  },
  {
    name: 'Sahabat Alumni Gadjah Mada',
    status: 'attending',
    statusLabel: 'Kula Badhe Rawuh (Hadir)',
    text: 'Selamat untuk Example & Example! Semoga senantiasa dipenuhi cinta dan keberkahan dalam bahtera rumah tangga yang sakinah. Sampai jumpa di Bangsal Pagelaran Keraton!',
    time: '2 dinten kepengker'
  }
];

function initGuestbook() {
  const form = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');

  // Load existing wishes from localStorage or set initial
  let storedWishes = [];
  try {
    const raw = localStorage.getItem('wedding_wishes_sekar_danang');
    if (raw) {
      storedWishes = JSON.parse(raw);
    } else {
      storedWishes = INITIAL_WISHES;
      localStorage.setItem('wedding_wishes_sekar_danang', JSON.stringify(storedWishes));
    }
  } catch (e) {
    storedWishes = INITIAL_WISHES;
  }

  // Render Wishes
  renderWishes(storedWishes, wishesList);

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('rsvp-name').value.trim();
      const attendanceVal = document.getElementById('rsvp-attendance').value;
      const countVal = document.getElementById('rsvp-count').value;
      const messageVal = document.getElementById('rsvp-message').value.trim();

      if (!nameVal || !messageVal) {
        showToast('Nyuwun tulung isi asma lan donga panyuwun.');
        return;
      }

      let statusBadge = 'attending';
      let statusLabel = 'Kula Badhe Rawuh (Hadir)';
      if (attendanceVal === 'absent') {
        statusBadge = 'absent';
        statusLabel = 'Nyuwun Pangapunten Mboten Saged Rawuh';
      } else if (attendanceVal === 'maybe') {
        statusBadge = 'maybe';
        statusLabel = 'Taksih Ragu / Rencana';
      }

      const newWish = {
        name: sanitizeText(nameVal),
        status: statusBadge,
        statusLabel: statusLabel,
        text: sanitizeText(messageVal),
        time: 'Nembe kemawon (Baru saja)'
      };

      storedWishes.unshift(newWish);

      try {
        localStorage.setItem('wedding_wishes_sekar_danang', JSON.stringify(storedWishes));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      renderWishes(storedWishes, wishesList);
      document.getElementById('rsvp-message').value = '';

      showToast('Matur nuwun! Donga lan ucapan panjenengan sampun kasimpen.');
    });
  }
}

function renderWishes(wishes, container) {
  if (!container) return;

  container.innerHTML = '';
  wishes.forEach(item => {
    const div = document.createElement('div');
    div.className = 'wish-item';
    div.innerHTML = `
      <div class="wish-header">
        <span class="wish-author">${item.name}</span>
        <span class="wish-badge ${item.status}">${item.statusLabel}</span>
      </div>
      <p class="wish-text">${item.text}</p>
      <span class="wish-time">${item.time}</span>
    `;
    container.appendChild(div);
  });
}

/**
 * 8. Photo Gallery Lightbox
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal || !modalImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption');
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Dhaup Suci Sekar & Danang';
        if (modalCaption && caption) {
          modalCaption.textContent = caption.textContent;
        }
        modal.classList.add('active');
      }
    });
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 9. Bottom Navigation Dock Active Tracking
 */
function initBottomDockNav() {
  const dockItems = document.querySelectorAll('.dock-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 250;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    dockItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Helper: Sanitizing text input to prevent XSS
 */
function sanitizeText(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}
