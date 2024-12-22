'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please enter your message');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      setStatus('error');
      toast.error(errorMessage, {
        className: 'bg-neutral-900/95 text-white border border-white/10 backdrop-blur-xl'
      });
      return;
    }

    setStatus('loading');
    const loadingToast = toast.loading('Sending message...', {
      className: 'bg-neutral-900/95 text-white border border-white/10 backdrop-blur-xl'
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      toast.success('Message sent successfully!', {
        id: loadingToast,
        className: 'bg-neutral-900/95 text-white border border-white/10 backdrop-blur-xl',
        description: 'Thank you for reaching out. I will get back to you soon.'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message. Please try again later.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg, {
        id: loadingToast,
        className: 'bg-neutral-900/95 text-white border border-white/10 backdrop-blur-xl'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative min-h-screen py-24 overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,1)_0%,rgba(0,0,0,0.9)_100%)]"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(56,189,248,0.12),transparent)]" />

      <div className="relative max-w-screen-xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-7xl md:text-8xl lg:text-9xl font-light text-white/90 mb-32"
        >
          Contact
          <motion.span
            className="absolute -bottom-3 left-0 w-1/3 h-px bg-sky-500/50"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.h2>

        <div className="grid md:grid-cols-[1fr,1.5fr] gap-12 md:gap-24">
          {/* Contact Info */}
          <div className="space-y-12">
            <motion.p
              className="text-2xl text-white/80 font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Let's discuss your project and explore how we can create something extraordinary together.
            </motion.p>

            <div className="space-y-8">
              {[
                { 
                  icon: Mail, 
                  label: "Email",
                  value: "hello@mandip.dev",
                  link: "mailto:hello@mandip.dev"
                },
                { 
                  icon: MapPin, 
                  label: "Location",
                  value: "Hattiesburg, Mississippi, USA",
                  link: "https://maps.app.goo.gl/nThk3ADVxW7EpZGu9"
                }
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-6 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * i }}
                >
                  <div className="relative shrink-0">
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center 
                        border border-sky-500/20 group-hover:border-sky-500/30 transition-all duration-300
                        group-hover:shadow-[0_0_15px_-3px_rgba(56,189,248,0.15)]"
                      whileHover={{ scale: 1.05 }}
                    >
                      <item.icon className="w-5 h-5 text-sky-500/80" />
                    </motion.div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/50 text-sm">{item.label}</p>
                    <p className="text-xl text-white/90 font-light group-hover:text-sky-500/80 transition-colors">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {[
              { name: 'name', label: 'Name', type: 'text' },
              { name: 'email', label: 'Email', type: 'email' }
            ].map((field) => (
              <div key={field.name} className="relative">
                <motion.input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput(field.name)}
                  onBlur={() => setFocusedInput(null)}
                  disabled={status === 'loading'}
                  className="w-full bg-neutral-900/50 border border-sky-500/20 rounded-xl px-6 py-4 text-white/80 
                    focus:outline-none focus:border-sky-500/30 transition-colors duration-300
                    placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={field.label}
                />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-sky-500/10 -z-10 opacity-0 blur-xl transition-opacity duration-300"
                  animate={{ opacity: focusedInput === field.name ? 0.15 : 0 }}
                />
              </div>
            ))}

            <div className="relative">
              <motion.textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput('message')}
                onBlur={() => setFocusedInput(null)}
                disabled={status === 'loading'}
                rows={6}
                className="w-full bg-neutral-900/50 border border-sky-500/20 rounded-xl px-6 py-4 text-white/80 
                  focus:outline-none focus:border-sky-500/30 transition-colors duration-300 resize-none
                  placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Message"
              />
              <motion.div
                className="absolute inset-0 rounded-xl bg-sky-500/10 -z-10 opacity-0 blur-xl transition-opacity duration-300"
                animate={{ opacity: focusedInput === 'message' ? 0.15 : 0 }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === 'loading'}
              className="group flex items-center gap-2 bg-white/5 text-white/90 px-8 py-4 rounded-xl
                border border-white/10 hover:bg-white/10 transition-all duration-300
                relative overflow-hidden backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
              whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
            >
              <span className="relative z-10">
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </span>
              {status === 'loading' ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white/90 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
              )}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: '100%' }}
                whileHover={{ x: '-100%' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
} 