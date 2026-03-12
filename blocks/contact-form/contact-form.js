/*
 * Contact Form Block
 * Renders a contact form (name, email, contact number, inquiry/notes) and submits to a configurable
 * endpoint (e.g. Formspree) to send the data by email.
 */

import { readBlockConfig } from '../../scripts/aem.js';

function buildField(label, name, type = 'text', required = true, tagName = 'input', placeholder = '') {
  const wrapper = document.createElement('div');
  wrapper.className = 'contact-form-field';
  const labelEl = document.createElement('label');
  labelEl.htmlFor = name;
  labelEl.textContent = label;
  const control = document.createElement(tagName);
  control.id = name;
  control.name = name;
  control.required = required;
  if (placeholder) control.placeholder = placeholder;
  if (tagName === 'input') {
    control.type = type;
    if (type === 'email') control.autocomplete = 'email';
    if (type === 'tel') control.autocomplete = 'tel';
  } else if (tagName === 'textarea') {
    control.rows = 5;
  }
  wrapper.append(labelEl, control);
  return wrapper;
}

export default function decorate(block) {
  const config = readBlockConfig(block);
  const formEndpoint = (config['form-endpoint'] || config.formEndpoint || '').trim();

  block.textContent = '';

  const form = document.createElement('form');
  form.className = 'contact-form-form';
  form.method = 'post';
  if (formEndpoint) form.action = formEndpoint;

  form.append(
    buildField('Name', 'name', 'text', true, 'input', 'Your name'),
    buildField('Email', 'email', 'email', true, 'input', 'your@email.com'),
    buildField('Contact number', 'phone', 'tel', false, 'input', 'Phone number'),
    buildField('Inquiry, notes, or questions', 'message', 'text', true, 'textarea', 'Your message...'),
  );

  const actions = document.createElement('div');
  actions.className = 'contact-form-actions';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'contact-form-submit button primary';
  submitBtn.textContent = 'Send';
  actions.append(submitBtn);
  form.append(actions);

  const messageEl = document.createElement('div');
  messageEl.className = 'contact-form-message';
  messageEl.setAttribute('aria-live', 'polite');
  messageEl.hidden = true;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formEndpoint) {
      messageEl.textContent = 'Form is not configured: add a "Form Endpoint" row with your Formspree (or similar) URL in the document.';
      messageEl.hidden = false;
      messageEl.classList.add('contact-form-message-error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    messageEl.hidden = true;
    messageEl.classList.remove('contact-form-message-success', 'contact-form-message-error');

    const formData = new FormData(form);
    const body = new URLSearchParams(formData);

    try {
      const res = await fetch(formEndpoint, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });
      if (res.ok) {
        messageEl.textContent = 'Thank you. Your message has been sent.';
        messageEl.classList.add('contact-form-message-success');
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data.error || `Something went wrong (${res.status}). Please try again or contact us by email.`;
        messageEl.textContent = msg;
        messageEl.classList.add('contact-form-message-error');
      }
    } catch {
      messageEl.textContent = 'Could not send. Check your connection and try again.';
      messageEl.classList.add('contact-form-message-error');
    }
    messageEl.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send';
  });

  block.append(form, messageEl);
}
