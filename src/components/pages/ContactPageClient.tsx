'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PharaohBorder } from '@/components/sections/EgyptianDecor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface WorkingHour {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface ContactData {
  companyName?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  phoneAlt?: string;
  email?: string;
  emailSales?: string;
  whatsapp?: string;
  workingHours?: WorkingHour[] | Record<string, { open: string; close: string; closed: boolean }>;
  customerServiceNote?: string;
  mapEmbed?: string;
}

export function ContactPageClient() {
  const [contact, setContact] = useState<ContactData>({
    city: 'Faiyum',
    country: 'Egypt',
    email: 'export@al-rehabgroup.com',
    emailSales: 'export@al-rehabgroup.com',
    phone: '+201055558189',
    customerServiceNote: 'Available 24/7',
  });

  useEffect(() => {
    fetch('/api/contact-info?key=main')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setContact(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const formatPhone = (phone: string) => {
    const clean = phone.replace(/[^0-9+]/g, '');
    if (clean.startsWith('+20') && clean.length >= 12) {
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)} ${clean.slice(9)}`;
    }
    return phone;
  };

  const formatBusinessHours = (hours?: WorkingHour[] | Record<string, { open: string; close: string; closed: boolean }>) => {
    if (!hours) {
      return [
        'Monday - Friday: 9:00 AM - 6:00 PM (EET)',
        'Saturday: 10:00 AM - 3:00 PM (EET)',
        'Sunday: Closed'
      ];
    }

    // Convert object format to array format if needed
    let hoursArray: WorkingHour[];
    if (Array.isArray(hours)) {
      hoursArray = hours;
    } else {
      // Convert record format: { monday: { open, close, closed }, ... }
      hoursArray = Object.entries(hours).map(([day, value]) => ({
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
        openTime: value.open || '',
        closeTime: value.close || '',
        isClosed: value.closed || false,
      }));
    }

    if (hoursArray.length === 0) {
      return [
        'Monday - Friday: 9:00 AM - 6:00 PM (EET)',
        'Saturday: 10:00 AM - 3:00 PM (EET)',
        'Sunday: Closed'
      ];
    }
    
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sorted = [...hoursArray].sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek));
    
    const groups: { days: string[]; hours: string }[] = [];
    sorted.forEach(day => {
      const hourStr = day.isClosed ? 'Closed' : `${day.openTime} - ${day.closeTime}`;
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.hours === hourStr) {
        lastGroup.days.push(day.dayOfWeek);
      } else {
        groups.push({ days: [day.dayOfWeek], hours: hourStr });
      }
    });
    
    return groups.map(g => {
      const dayStr = g.days.length > 1 
        ? `${g.days[0]} - ${g.days[g.days.length - 1]}`
        : g.days[0];
      return g.hours === 'Closed' ? `${dayStr}: Closed` : `${dayStr}: ${g.hours} (EET)`;
    });
  };

  const getMapEmbedUrl = () => {
    if (contact.mapEmbed) {
      // Extract src from iframe if full HTML is provided
      const srcMatch = contact.mapEmbed.match(/src="([^"]+)"/);
      if (srcMatch) return srcMatch[1];
      // If it's already a URL, return it
      if (contact.mapEmbed.startsWith('http')) return contact.mapEmbed;
    }
    // Default Faiyum map
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110315.87693054387!2d30.74437!3d29.30869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14585a8329fc92c5%3A0x4d0f2f8c8e965f2e!2sFaiyum%2C%20Egypt!5e0!3m2!1sen!2s!4v1234567890";
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limiting (429)
        if (response.status === 429) {
          const retryAfter = data.retryAfter;
          const hours = Math.ceil(retryAfter / 3600);
          setSubmitError(`Too many messages sent. Please try again in ${hours} hour${hours !== 1 ? 's' : ''}.`);
        } else {
          setSubmitError(data.error || 'Failed to send your message. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      toast.success(data.message || 'Thank you for your inquiry! We will contact you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        company: '',
        country: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('An error occurred while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-[#2d7a3e]/10 text-[#2d7a3e] rounded-full border border-[#2d7a3e]/20">
                Get In Touch
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-6">
              Start Your Export Journey
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
              Connect with us to discuss your herbs and spices requirements. 
              We&apos;re here to support your business growth.
            </p>

            <PharaohBorder className="w-48 mx-auto text-[#c4a24c] opacity-30" />
          </motion.div>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-[#2d7a3e] to-[#1d5a2e] rounded-2xl p-8 md:p-10 shadow-xl h-full">
                <h3 className="text-2xl sm:text-3xl text-white mb-6">
                  Let&apos;s Grow Together
                </h3>
                <p className="text-white/80 mb-8 text-base sm:text-lg">
                  Whether you&apos;re looking to import premium Egyptian herbs and spices or need a 
                  reliable long-term partner, we&apos;re ready to serve you.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#c4a24c] rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Our Location</h4>
                      <p className="text-white/70 text-sm">
                        {contact.address && `${contact.address}, `}{contact.city}, {contact.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#c4a24c] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Email Us</h4>
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="text-white/70 hover:text-white transition-colors text-sm block">
                          {contact.email}
                        </a>
                      )}
                      {contact.emailSales && (
                        <a href={`mailto:${contact.emailSales}`} className="text-white/70 hover:text-white transition-colors text-sm block">
                          {contact.emailSales}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#c4a24c] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Call Us</h4>
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="text-white/70 hover:text-white transition-colors text-sm block">
                          {formatPhone(contact.phone)}
                        </a>
                      )}
                      {contact.phoneAlt && (
                        <a href={`tel:${contact.phoneAlt}`} className="text-white/70 hover:text-white transition-colors text-sm block">
                          {formatPhone(contact.phoneAlt)}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#c4a24c] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Customer Service</h4>
                      <p className="text-white/70 text-sm">{contact.customerServiceNote || 'Available 24/7'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                  <h4 className="text-white mb-4">Business Hours</h4>
                  <div className="text-white/70 space-y-2 text-sm">
                    {formatBusinessHours(contact.workingHours).map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-amber-50/50 to-emerald-50/50 rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100">
                <h3 className="text-2xl text-gray-900 mb-6">
                  Request Export Quote
                </h3>

                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{submitError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="border-gray-300 focus:border-[#2d7a3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@company.com"
                        className="border-gray-300 focus:border-[#2d7a3e]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        placeholder="Your Company Ltd."
                        className="border-gray-300 focus:border-[#2d7a3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        className="border-gray-300 focus:border-[#2d7a3e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Country *
                    </label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      placeholder="United Kingdom"
                      className="border-gray-300 focus:border-[#2d7a3e]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us about your requirements, desired products, quantities, and any specific certifications you need..."
                      className="border-gray-300 focus:border-[#2d7a3e] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2d7a3e] hover:bg-[#235a2f] text-white py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} className="mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    We typically respond within 24 hours during business days
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-amber-50/30 to-emerald-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Located in {contact.city}, {contact.country} - strategically positioned for efficient international trade
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
          >
            <iframe
              src={getMapEmbedUrl()}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${contact.city}, ${contact.country} Location`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100">
              <MapPin className="w-5 h-5 text-[#2d7a3e]" />
              <span className="text-gray-900">{contact.companyName || 'Al-Rehab Group for Export'} - {contact.city}, {contact.country}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
