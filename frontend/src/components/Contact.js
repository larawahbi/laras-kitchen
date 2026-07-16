import { useState } from 'react';
import t from '../translations';
import SocialIcons from './SocialIcons';
import { useInView } from '../hooks/useInView';

const EMPTY = { name: '', email: '', message: '', botField: '' };

function validate(fields, tr) {
  const errors = {};
  if (!fields.name.trim()) errors.name = tr.contact_err_name;
  if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = tr.contact_err_email;
  }
  if (!fields.message.trim()) errors.message = tr.contact_err_message;
  return errors;
}

function Contact({ lang }) {
  const tr = t[lang];
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const [greetingRef, greetingInView] = useInView({ threshold: 0.1 });
  const [formRef, formInView] = useInView({ threshold: 0.1 });

  function onChange(e) {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: undefined }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const errs = validate(fields, tr);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (fields.botField) { setStatus('success'); return; }
    setStatus('submitting');
    try {
      const body = new URLSearchParams({
        'form-name': 'contact',
        name: fields.name,
        email: fields.email,
        message: fields.message,
        'bot-field': fields.botField,
      });
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-page page-fade-in">
        <div className="contact-success">
          <h2 className="contact-success-heading">{tr.contact_success_heading}</h2>
          <p className="contact-success-body">{tr.contact_success_body}</p>
          <div className="footer-social">
            <SocialIcons />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page page-fade-in">

      <div
        ref={greetingRef}
        className={`contact-greeting about-bilingual-phrases about-reveal${greetingInView ? ' is-visible' : ''}`}
        aria-hidden="true"
      >
        <span className="about-bilingual-phrase-en" dir="ltr">{tr.contact_greeting_en}</span>
        <span className="about-bilingual-phrase-rule"></span>
        <span className="about-bilingual-phrase-ar">{tr.contact_greeting_ar}</span>
      </div>

      <p className="contact-intro">{tr.contact_intro}</p>

      <div ref={formRef} className={`contact-inner about-reveal${formInView ? ' is-visible' : ''}`}>
        <form name="contact" method="POST" onSubmit={onSubmit} className="contact-form" noValidate>
          <input type="hidden" name="form-name" value="contact" />

          <div className="contact-honeypot" aria-hidden="true">
            <label>
              Do not fill this out
              <input
                name="bot-field"
                value={fields.botField}
                onChange={onChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <div className="contact-name-email-row">
            <div className={`contact-field${errors.name ? ' contact-field--error' : ''}`}>
              <label htmlFor="contact-name" className="contact-label">{tr.contact_name_label}</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={fields.name}
                onChange={onChange}
                placeholder={tr.contact_name_placeholder}
                className="contact-input"
                autoComplete="name"
              />
              {errors.name && <span className="contact-error-msg" role="alert">{errors.name}</span>}
            </div>

            <div className={`contact-field${errors.email ? ' contact-field--error' : ''}`}>
              <label htmlFor="contact-email" className="contact-label">{tr.contact_email_label}</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={fields.email}
                onChange={onChange}
                placeholder={tr.contact_email_placeholder}
                className="contact-input"
                autoComplete="email"
              />
              {errors.email && <span className="contact-error-msg" role="alert">{errors.email}</span>}
            </div>
          </div>

          <div className={`contact-field${errors.message ? ' contact-field--error' : ''}`}>
            <label htmlFor="contact-message" className="contact-label">{tr.contact_message_label}</label>
            <textarea
              id="contact-message"
              name="message"
              value={fields.message}
              onChange={onChange}
              placeholder={tr.contact_message_placeholder}
              className="contact-input contact-textarea"
              rows={6}
            />
            {errors.message && <span className="contact-error-msg" role="alert">{errors.message}</span>}
          </div>

          {status === 'error' && (
            <p className="contact-submit-error" role="alert">{tr.contact_error}</p>
          )}

          <button
            type="submit"
            className="contact-submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? tr.contact_submitting : tr.contact_submit}
          </button>
        </form>
      </div>

      <div className="contact-social">
        <SocialIcons />
      </div>

    </div>
  );
}

export default Contact;
