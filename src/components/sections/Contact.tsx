'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PharaohBorder, LotusIcon } from './EgyptianDecor';
import { useState, useRef, useEffect } from 'react';
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
}

export function Contact() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yLotus = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

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
    
    // Group consecutive days with same hours
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage for admin panel
    if (typeof window !== 'undefined') {
      const existingRequests = JSON.parse(localStorage.getItem('exportRequests') || '[]');
      const newRequest = {
        id: Date.now().toString(),
        ...formData,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('exportRequests', JSON.stringify([...existingRequests, newRequest]));
    }
    
    toast.success('Thank you for your inquiry! We will contact you within 24 hours.');
    
    setFormData({
      name: '',
      email: '',
      company: '',
      country: '',
      phone: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section ref={ref} id="contact" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-amber-50/30 to-white relative overflow-hidden">
      {/* Parallax Background Decoration */}
      <motion.div 
        style={{ y: yLotus, rotate }}
        className="absolute top-20 right-20 opacity-5 hidden md:block"
      >
        <LotusIcon className="w-64 h-64 text-[#2d7a3e]" />
      </motion.div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-block mb-3 sm:mb-4">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2d7a3e]/10 text-[#2d7a3e] rounded-full border border-[#2d7a3e]/20 text-xs sm:text-sm md:text-base">
              Get In Touch
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-6 px-4">
            Start Your Export Journey
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-4 sm:mb-6 px-4">
            Connect with us to discuss your herbs and spices requirements. We&apos;re here to support your business growth.
          </p>
          
          {/* Decorative Border */}
          <div className="text-[#c4a24c] opacity-30">
            <PharaohBorder className="w-48 sm:w-64 mx-auto" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Contact Information with Parallax */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              y: useTransform(scrollYProgress, [0, 1], [0, -30])
            }}
          >
            <motion.div 
              style={{ scale }}
              className="bg-gradient-to-br from-[#2d7a3e] to-[#1d5a2e] rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl h-full"
            >
              <h3 className="text-2xl sm:text-3xl text-white mb-4 sm:mb-6">
                Let&apos;s Grow Together
              </h3>
              <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
                Whether you&apos;re looking to import premium Egyptian herbs and spices or need a reliable long-term partner, we&apos;re ready to serve you.
              </p>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#c4a24c] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1 text-sm sm:text-base">Our Location</h4>
                    <p className="text-white/70 text-xs sm:text-sm">
                      {contact.address && `${contact.address}, `}{contact.city}, {contact.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#c4a24c] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1 text-sm sm:text-base">Email Us</h4>
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm block">
                        {contact.email}
                      </a>
                    )}
                    {contact.emailSales && (
                      <a href={`mailto:${contact.emailSales}`} className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm block">
                        {contact.emailSales}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#c4a24c] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1 text-sm sm:text-base">Call Us</h4>
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm block">
                        {formatPhone(contact.phone)}
                      </a>
                    )}
                    {contact.phoneAlt && (
                      <a href={`tel:${contact.phoneAlt}`} className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm block">
                        {formatPhone(contact.phoneAlt)}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#c4a24c] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1 text-sm sm:text-base">Customer Service</h4>
                    <p className="text-white/70 text-xs sm:text-sm">{contact.customerServiceNote || 'Available 24/7'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20">
                <h4 className="text-white mb-3 sm:mb-4 text-sm sm:text-base">Business Hours</h4>
                <div className="text-white/70 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  {formatBusinessHours(contact.workingHours).map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form with Parallax */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              y: useTransform(scrollYProgress, [0, 1], [0, -20])
            }}
          >
            <motion.div 
              style={{ scale }}
              className="bg-gradient-to-br from-amber-50/50 to-emerald-50/50 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100"
            >
              <h3 className="text-xl sm:text-2xl text-gray-900 mb-4 sm:mb-6">
                Request Export Quote
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="border-gray-300 focus:border-[#2d7a3e]"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-700 mb-2">
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
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      placeholder="Your Company Ltd."
                      className="border-gray-300 focus:border-[#2d7a3e]"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className="border-gray-300 focus:border-[#2d7a3e]"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                    Country *
                  </label>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    placeholder="United Kingdom"
                    className="border-gray-300 focus:border-[#2d7a3e]"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-2">
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
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2d7a3e] hover:bg-[#235a2f] text-white py-5 sm:py-6"
                >
                  <Send size={20} className="mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </Button>

                <p className="text-xs sm:text-sm text-gray-500 text-center">
                  We typically respond within 24 hours during business days
                </p>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
