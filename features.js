(() => {
  'use strict';

  const isEnglish = (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const copy = isEnglish ? {
    question: 'Question', of: 'of', completed: 'completed', read: 'read', unread: 'Mark as read', readLabel: 'Read',
    journalSaved: 'Entry saved locally on this device.', journalLimit: 'Your 7 most recent entries are kept.',
    noEntries: 'Your observations will appear here after the first entry.', reflection: 'Reflection',
    confirmJournal: 'Clear all journal entries saved on this device?', confirmPrep: 'Reset your preparation progress?',
    contactError: 'Please complete the required fields and check the email address.',
    contactReady: 'Your email app is opening. Review the message before sending it.',
    contactSending: 'Sending your message…',
    contactSent: 'Sent — I will reply within 24 hours.',
    contactFailed: 'Sending failed. Opening your email app instead.',
    contactSubject: 'Website enquiry', contactIntro: 'Message from the contact form on weronikawasiakowska.com',
    name: 'Name', email: 'Email', message: 'Message', averages: { tension: 'Tension', sleep: 'Sleep', energy: 'Energy', focus: 'Focus' },
    resultFallback: 'This is a gentle direction for further reflection, not a diagnosis.'
  } : {
    question: 'Pytanie', of: 'z', completed: 'ukończono', read: 'przeczytane', unread: 'Oznacz jako przeczytane', readLabel: 'Przeczytane',
    journalSaved: 'Wpis zapisano lokalnie na tym urządzeniu.', journalLimit: 'Zachowujemy 7 najnowszych wpisów.',
    noEntries: 'Twoje obserwacje pojawią się tutaj po pierwszym wpisie.', reflection: 'Refleksja',
    confirmJournal: 'Usunąć wszystkie wpisy dziennika zapisane na tym urządzeniu?', confirmPrep: 'Wyzerować postęp przygotowania?',
    contactError: 'Uzupełnij wymagane pola i sprawdź poprawność adresu e-mail.',
    contactReady: 'Otwieram aplikację pocztową. Sprawdź wiadomość przed wysłaniem.',
    contactSending: 'Wysyłam wiadomość…',
    contactSent: 'Wysłano — odpowiem w ciągu 24 godzin.',
    contactFailed: 'Wysyłka się nie powiodła. Otwieram aplikację pocztową.',
    contactSubject: 'Zapytanie ze strony', contactIntro: 'Wiadomość z formularza na weronikawasiakowska.com',
    name: 'Imię', email: 'E-mail', message: 'Wiadomość', averages: { tension: 'Napięcie', sleep: 'Sen', energy: 'Energia', focus: 'Koncentracja' },
    resultFallback: 'To łagodna wskazówka do dalszej refleksji, a nie diagnoza.'
  };

  const storage = {
    get(key, fallback) {
      try {
        const value = JSON.parse(localStorage.getItem(key));
        return value == null ? fallback : value;
      } catch (_) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* private mode */ }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (_) { /* private mode */ }
    }
  };

  const setProgress = (bar, percentage) => {
    if (!bar) return;
    const value = Math.max(0, Math.min(100, Math.round(percentage)));
    if (bar.matches('progress')) bar.value = value;
    else {
      bar.style.setProperty('--progress', `${value}%`);
      bar.style.width = `${value}%`;
      bar.setAttribute('aria-valuenow', String(value));
    }
  };

  function initCheckin() {
    const root = document.querySelector('[data-neuro-checkin]');
    if (!root) return;
    const steps = [...root.querySelectorAll('[data-checkin-step]')];
    const results = root.querySelector('[data-checkin-results]');
    const resultPanels = [...root.querySelectorAll('[data-checkin-result]')];
    const progress = root.querySelector('[data-checkin-progress]');
    const progressText = root.querySelector('[data-checkin-progress-text]');
    const restart = root.querySelector('[data-checkin-restart]');
    if (!steps.length) return;

    let current = 0;
    let scores = { regulation: 0, patterns: 0, energy: 0, food: 0 };
    let answerLocked = false;

    const showStep = (index) => {
      current = index;
      answerLocked = false;
      steps.forEach((step, i) => {
        step.hidden = i !== index;
        step.setAttribute('aria-hidden', String(i !== index));
      });
      if (results) results.hidden = true;
      const percentage = (index / steps.length) * 100;
      setProgress(progress, percentage);
      if (progressText) progressText.textContent = `${copy.question} ${Math.min(index + 1, steps.length)} ${copy.of} ${steps.length}`;
      const heading = steps[index]?.querySelector('h3, h2, [data-step-heading]');
      if (heading && index > 0) heading.focus?.({ preventScroll: true });
    };

    const showResult = () => {
      steps.forEach(step => { step.hidden = true; step.setAttribute('aria-hidden', 'true'); });
      setProgress(progress, 100);
      if (progressText) progressText.textContent = `100% ${copy.completed}`;
      const ranking = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const winner = ranking[0]?.[0] || 'regulation';
      resultPanels.forEach(panel => {
        const active = panel.dataset.checkinResult === winner;
        panel.hidden = !active;
        panel.setAttribute('aria-hidden', String(!active));
      });
      if (results) {
        results.hidden = false;
        results.dataset.result = winner;
        const live = results.querySelector('[data-checkin-live]');
        if (live) live.textContent = resultPanels.find(panel => !panel.hidden)?.textContent.trim() || copy.resultFallback;
        results.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
      }
    };

    root.addEventListener('click', event => {
      const answer = event.target.closest('[data-checkin-answer]');
      if (!answer || !root.contains(answer) || answerLocked) return;
      answerLocked = true;
      const domain = answer.dataset.domain;
      const score = Number(answer.dataset.score || 1);
      if (Object.prototype.hasOwnProperty.call(scores, domain)) scores[domain] += Number.isFinite(score) ? score : 1;
      answer.closest('[data-checkin-step]')?.querySelectorAll('[data-checkin-answer]').forEach(button => {
        button.setAttribute('aria-pressed', String(button === answer));
      });
      window.setTimeout(() => current + 1 < steps.length ? showStep(current + 1) : showResult(), 140);
    });

    restart?.addEventListener('click', () => {
      scores = { regulation: 0, patterns: 0, energy: 0, food: 0 };
      answerLocked = false;
      root.querySelectorAll('[data-checkin-answer]').forEach(button => button.setAttribute('aria-pressed', 'false'));
      showStep(0);
    });
    showStep(0);
  }

  function initKnowledgeHub() {
    const root = document.querySelector('[data-knowledge-hub]');
    if (!root) return;
    const key = 'ww-knowledge-read-v1';
    const cards = [...root.querySelectorAll('[data-knowledge-card]')];
    const filters = [...root.querySelectorAll('[data-knowledge-filter]')];
    const progress = root.querySelector('[data-knowledge-progress]');
    const progressText = root.querySelector('[data-knowledge-progress-text]');
    let readIds = new Set(storage.get(key, []));

    const update = () => {
      cards.forEach((card, index) => {
        const id = card.dataset.articleId || `article-${index + 1}`;
        const button = card.querySelector('[data-mark-read]');
        const isRead = readIds.has(id);
        card.classList.toggle('is-read', isRead);
        if (button) {
          button.setAttribute('aria-pressed', String(isRead));
          button.textContent = isRead ? copy.readLabel : copy.unread;
        }
      });
      const total = cards.length;
      const readCount = cards.reduce((count, card, index) => count + (readIds.has(card.dataset.articleId || `article-${index + 1}`) ? 1 : 0), 0);
      setProgress(progress, total ? (readCount / total) * 100 : 0);
      if (progressText) progressText.textContent = `${readCount}/${total} ${copy.read}`;
      storage.set(key, [...readIds]);
    };

    filters.forEach(filter => filter.addEventListener('click', () => {
      const category = filter.dataset.knowledgeFilter || 'all';
      filters.forEach(item => {
        const active = item === filter;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      cards.forEach(card => {
        const categories = (card.dataset.category || '').split(/\s+/);
        card.hidden = category !== 'all' && !categories.includes(category);
      });
    }));

    root.addEventListener('click', event => {
      const button = event.target.closest('[data-mark-read]');
      if (!button) return;
      const card = button.closest('[data-knowledge-card]');
      const index = cards.indexOf(card);
      const id = card?.dataset.articleId || `article-${index + 1}`;
      if (readIds.has(id)) readIds.delete(id); else readIds.add(id);
      update();
    });
    update();
  }

  function initEvidence() {
    document.querySelectorAll('[data-evidence-system]').forEach(root => {
      const levels = [...root.querySelectorAll('.evidence-level')];
      const explainer = root.querySelector('[data-evidence-explainer]');
      levels.forEach(level => {
        const button = level.querySelector('[data-evidence-button]');
        if (!button) return;
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => {
          const opening = !level.classList.contains('is-active');
          levels.forEach(item => {
            item.classList.remove('is-active');
            item.querySelector('[data-evidence-button]')?.setAttribute('aria-pressed', 'false');
          });
          if (opening) {
            level.classList.add('is-active');
            button.setAttribute('aria-pressed', 'true');
            if (explainer) explainer.textContent = button.dataset.detail || '';
          }
        });
      });
    });
  }

  function initTimeline() {
    document.querySelectorAll('[data-session-timeline]').forEach(root => {
      const items = [...root.querySelectorAll('[data-timeline-item]')];
      items.forEach((item, index) => {
        const trigger = item.querySelector('[data-timeline-trigger]');
        const panel = item.querySelector('[data-timeline-panel]');
        if (!trigger || !panel) return;
        if (!panel.id) panel.id = `session-step-${index + 1}`;
        trigger.setAttribute('aria-controls', panel.id);
        const open = item.classList.contains('active') || trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(open));
        panel.hidden = !open;
        trigger.addEventListener('click', () => {
          const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
          items.forEach(other => {
            const otherTrigger = other.querySelector('[data-timeline-trigger]');
            const otherPanel = other.querySelector('[data-timeline-panel]');
            other.classList.remove('active');
            otherTrigger?.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.hidden = true;
          });
          item.classList.toggle('active', willOpen);
          trigger.setAttribute('aria-expanded', String(willOpen));
          panel.hidden = !willOpen;
        });
      });
    });
  }

  function initPreparation() {
    document.querySelectorAll('[data-preparation-path]').forEach((root, rootIndex) => {
      const key = `ww-preparation-v1-${root.dataset.preparationId || rootIndex}`;
      const checks = [...root.querySelectorAll('[data-prep-item]')];
      const progress = root.querySelector('[data-prep-progress]');
      const progressText = root.querySelector('[data-prep-progress-text]');
      const saved = new Set(storage.get(key, []));
      const idFor = (check, index) => check.dataset.prepId || check.value || `item-${index + 1}`;
      checks.forEach((check, index) => { check.checked = saved.has(idFor(check, index)); });

      const update = () => {
        const done = checks.reduce((count, check) => count + (check.checked ? 1 : 0), 0);
        setProgress(progress, checks.length ? (done / checks.length) * 100 : 0);
        if (progressText) progressText.textContent = `${done}/${checks.length} ${copy.completed}`;
        storage.set(key, checks.map((check, index) => check.checked ? idFor(check, index) : null).filter(Boolean));
        root.classList.toggle('is-complete', checks.length > 0 && done === checks.length);
      };
      checks.forEach(check => check.addEventListener('change', update));
      root.querySelector('[data-prep-reset]')?.addEventListener('click', () => {
        if (!window.confirm(copy.confirmPrep)) return;
        checks.forEach(check => { check.checked = false; });
        update();
      });
      update();
    });
  }

  function initJournal() {
    const root = document.querySelector('[data-neuro-journal]');
    if (!root) return;
    const key = 'ww-neuro-journal-v1';
    const form = root.querySelector('[data-journal-form]') || (root.matches('form') ? root : null);
    const chart = root.querySelector('[data-journal-chart]');
    const history = root.querySelector('[data-journal-history]');
    const status = root.querySelector('[data-journal-status]');
    let entries = storage.get(key, []);
    if (!Array.isArray(entries)) entries = [];

    const safeNumber = value => Math.max(1, Math.min(10, Number(value)));
    const render = () => {
      const metrics = ['tension', 'sleep', 'energy', 'focus'];
      if (chart) {
        chart.replaceChildren();
        metrics.forEach(metric => {
          const average = entries.length ? entries.reduce((sum, entry) => sum + safeNumber(entry[metric]), 0) / entries.length : 0;
          const row = document.createElement('div');
          row.className = 'journal-average';
          const label = document.createElement('div');
          label.className = 'journal-average-label';
          const name = document.createElement('span');
          name.textContent = copy.averages[metric];
          const value = document.createElement('strong');
          value.textContent = entries.length ? average.toFixed(1) : '—';
          label.append(name, value);
          const track = document.createElement('div');
          track.className = 'journal-average-track';
          track.setAttribute('role', 'progressbar');
          track.setAttribute('aria-valuemin', '0');
          track.setAttribute('aria-valuemax', '10');
          track.setAttribute('aria-valuenow', average.toFixed(1));
          const fill = document.createElement('span');
          fill.style.width = `${average * 10}%`;
          track.append(fill);
          row.append(label, track);
          chart.append(row);
        });
      }
      if (history) {
        history.replaceChildren();
        if (!entries.length) {
          const empty = document.createElement('p');
          empty.className = 'journal-empty';
          empty.textContent = copy.noEntries;
          history.append(empty);
        } else {
          [...entries].reverse().forEach(entry => {
            const article = document.createElement('article');
            article.className = 'journal-entry';
            const date = document.createElement('time');
            date.dateTime = entry.createdAt;
            date.textContent = new Intl.DateTimeFormat(isEnglish ? 'en-GB' : 'pl-PL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(entry.createdAt));
            const values = document.createElement('p');
            values.textContent = Object.keys(copy.averages).map(metric => `${copy.averages[metric]} ${entry[metric]}/10`).join(' · ');
            article.append(date, values);
            if (entry.reflection) {
              const reflection = document.createElement('blockquote');
              reflection.textContent = `${copy.reflection}: ${entry.reflection}`;
              article.append(reflection);
            }
            history.append(article);
          });
        }
      }
      storage.set(key, entries);
    };

    form?.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const entry = {
        createdAt: new Date().toISOString(),
        tension: safeNumber(data.get('tension')),
        sleep: safeNumber(data.get('sleep')),
        energy: safeNumber(data.get('energy')),
        focus: safeNumber(data.get('focus')),
        reflection: String(data.get('reflection') || '').trim().slice(0, 1000)
      };
      entries = [...entries, entry].slice(-7);
      form.reset();
      if (status) status.textContent = `${copy.journalSaved} ${copy.journalLimit}`;
      render();
    });

    root.querySelectorAll('[data-journal-export]').forEach(button => button.addEventListener('click', () => {
      const format = button.dataset.exportFormat === 'text' ? 'text' : 'json';
      let body;
      if (format === 'text') {
        body = entries.map(entry => [
          new Date(entry.createdAt).toLocaleString(isEnglish ? 'en-GB' : 'pl-PL'),
          ...Object.keys(copy.averages).map(metric => `${copy.averages[metric]}: ${entry[metric]}/10`),
          `${copy.reflection}: ${entry.reflection || '—'}`
        ].join('\n')).join('\n\n');
      } else body = JSON.stringify({ exportedAt: new Date().toISOString(), entries }, null, 2);
      const blob = new Blob([body], { type: format === 'text' ? 'text/plain;charset=utf-8' : 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `neuro-journal.${format === 'text' ? 'txt' : 'json'}`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }));

    root.querySelector('[data-journal-clear]')?.addEventListener('click', () => {
      if (!window.confirm(copy.confirmJournal)) return;
      entries = [];
      storage.remove(key);
      if (status) status.textContent = '';
      render();
    });
    render();
  }

  function initContactForm() {
    document.querySelectorAll('form[data-contact-form]').forEach(form => {
      const status = form.querySelector('[data-contact-status]');
      const submitBtn = form.querySelector('button[type="submit"]');
      form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!form.reportValidity()) {
          if (status) status.textContent = copy.contactError;
          return;
        }
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        const subject = String(data.get('subject') || copy.contactSubject).trim();
        const message = String(data.get('message') || '').trim();

        const mailtoFallback = () => {
          const body = [copy.contactIntro, '', `${copy.name}: ${name}`, `${copy.email}: ${email}`, '', `${copy.message}:`, message].join('\n');
          const href = `mailto:hello@weronikawasiakowska.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.location.href = href;
        };

        if (submitBtn) submitBtn.disabled = true;
        if (status) status.textContent = copy.contactSending;
        try {
          const response = await fetch('contact.php', { method: 'POST', body: data });
          if (!response.ok) throw new Error('request_failed');
          const result = await response.json().catch(() => ({ ok: false }));
          if (!result.ok) throw new Error(result.error || 'request_failed');
          if (status) status.textContent = copy.contactSent;
          form.reset();
        } catch (err) {
          if (status) status.textContent = copy.contactFailed;
          mailtoFallback();
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    });
  }

  const init = () => {
    initCheckin();
    initKnowledgeHub();
    initEvidence();
    initTimeline();
    initPreparation();
    initJournal();
    initContactForm();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
