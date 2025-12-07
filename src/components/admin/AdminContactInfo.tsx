'use client';

import { Phone, Mail, MapPin, Clock, Save, Globe, Loader2, Building2, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BusinessHour {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface ContactInfo {
  key: string;
  companyName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  phoneAlt: string;
  email: string;
  emailSales: string;
  whatsapp: string;
  website: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  workingHours: BusinessHour[];
  customerServiceNote: string;
  mapEmbed: string;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30',
];

const defaultBusinessHours: BusinessHour[] = DAYS_OF_WEEK.map((day) => ({
  dayOfWeek: day,
  openTime: '09:00',
  closeTime: '18:00',
  isClosed: day === 'Sunday',
}));

const defaultContactInfo: ContactInfo = {
  key: 'main',
  companyName: 'Al-Rehab Group for Export',
  address: '',
  city: 'Faiyum',
  country: 'Egypt',
  phone: '+201055558189',
  phoneAlt: '',
  email: 'info@al-rehabgroup.com',
  emailSales: 'export@al-rehabgroup.com',
  whatsapp: '+201055558189',
  website: '',
  facebook: '',
  twitter: '',
  linkedin: '',
  instagram: '',
  youtube: '',
  workingHours: defaultBusinessHours,
  customerServiceNote: 'Available 24/7 for urgent inquiries',
  mapEmbed: '',
};

interface AdminContactInfoProps {
  initialData?: Partial<ContactInfo>;
}

export function AdminContactInfo({ initialData }: AdminContactInfoProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    ...defaultContactInfo,
    ...initialData,
    workingHours: initialData?.workingHours || defaultBusinessHours,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact-info?key=main', { credentials: 'include' });
      if (response.ok) {
        const responseData = await response.json();
        const data = responseData.data || responseData;
        // Parse workingHours if it's a string
        let workingHours = defaultBusinessHours;
        if (data.workingHours) {
          if (typeof data.workingHours === 'string') {
            try {
              workingHours = JSON.parse(data.workingHours);
            } catch {
              workingHours = defaultBusinessHours;
            }
          } else if (Array.isArray(data.workingHours)) {
            workingHours = data.workingHours;
          }
        }
        setContactInfo({
          ...defaultContactInfo,
          ...data,
          workingHours,
        });
      }
    } catch (err) {
      console.error('Failed to fetch contact info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...contactInfo,
        workingHours: contactInfo.workingHours,
      };

      const response = await fetch('/api/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save contact info');
      }

      toast({
        title: 'Success',
        description: 'Contact information saved successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save contact info',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleBusinessHourChange = (
    dayIndex: number,
    field: keyof BusinessHour,
    value: string | boolean
  ) => {
    setContactInfo((prev) => {
      const newHours = [...prev.workingHours];
      newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
      return { ...prev, workingHours: newHours };
    });
  };

  const toggleDayClosed = (dayIndex: number) => {
    setContactInfo((prev) => {
      const newHours = [...prev.workingHours];
      newHours[dayIndex] = {
        ...newHours[dayIndex],
        isClosed: !newHours[dayIndex].isClosed,
      };
      return { ...prev, workingHours: newHours };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2d7a3e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-teal-100 rounded-lg">
          <Phone className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-2xl text-gray-900">Contact Information</h1>
          <p className="text-sm text-gray-500">Manage your company contact details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-400" />
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={contactInfo.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                placeholder="Al-Rehab Group for Export"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={contactInfo.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                placeholder="Street address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={contactInfo.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                placeholder="Faiyum"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={contactInfo.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                placeholder="Egypt"
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-400" />
            Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Phone
              </label>
              <input
                type="text"
                value={contactInfo.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                placeholder="+201055558189"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternative Phone
              </label>
              <input
                type="text"
                value={contactInfo.phoneAlt || ''}
                onChange={(e) => handleChange('phoneAlt', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-green-500" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={contactInfo.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                placeholder="+201055558189"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g., +20 for Egypt)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="text"
                value={contactInfo.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                placeholder="https://www.al-rehabgroup.com"
              />
            </div>
          </div>
        </div>

        {/* Email Addresses */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-400" />
            Email Addresses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                General Email (info@)
              </label>
              <input
                type="email"
                value={contactInfo.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                placeholder="info@al-rehabgroup.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sales/Export Email
              </label>
              <input
                type="email"
                value={contactInfo.emailSales || ''}
                onChange={(e) => handleChange('emailSales', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                placeholder="export@al-rehabgroup.com"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Business Hours
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Set your opening hours for each day. Toggle the switch to mark a day as closed.
          </p>
          <div className="space-y-3">
            {contactInfo.workingHours.map((hours, index) => (
              <div
                key={hours.dayOfWeek}
                className={`flex flex-wrap items-center gap-3 p-3 rounded-lg transition-colors ${
                  hours.isClosed ? 'bg-gray-50' : 'bg-green-50'
                }`}
              >
                <div className="w-28 font-medium text-gray-700">
                  {hours.dayOfWeek}
                </div>
                
                <button
                  type="button"
                  onClick={() => toggleDayClosed(index)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:ring-offset-2 ${
                    hours.isClosed ? 'bg-gray-300' : 'bg-[#2d7a3e]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      hours.isClosed ? 'translate-x-0' : 'translate-x-5'
                    }`}
                  />
                </button>
                <span className={`text-sm ${hours.isClosed ? 'text-gray-500' : 'text-green-700'}`}>
                  {hours.isClosed ? 'Closed' : 'Open'}
                </span>

                {!hours.isClosed && (
                  <div className="flex items-center gap-2 ml-auto">
                    <select
                      value={hours.openTime}
                      onChange={(e) =>
                        handleBusinessHourChange(index, 'openTime', e.target.value)
                      }
                      className="px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={`open-${time}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-500">to</span>
                    <select
                      value={hours.closeTime}
                      onChange={(e) =>
                        handleBusinessHourChange(index, 'closeTime', e.target.value)
                      }
                      className="px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={`close-${time}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Service Note
            </label>
            <input
              type="text"
              value={contactInfo.customerServiceNote || ''}
              onChange={(e) => handleChange('customerServiceNote', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
              placeholder="e.g., Available 24/7 for urgent inquiries"
            />
            <p className="text-xs text-gray-500 mt-1">
              This note will be displayed alongside your business hours
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-400" />
            Social Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={contactInfo.facebook || ''}
                onChange={(e) => handleChange('facebook', e.target.value)}
                placeholder="https://facebook.com/alrehabgroup"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={contactInfo.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="https://instagram.com/alrehabgroup"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={contactInfo.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/alrehabgroup"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter / X
              </label>
              <input
                type="url"
                value={contactInfo.twitter || ''}
                onChange={(e) => handleChange('twitter', e.target.value)}
                placeholder="https://twitter.com/alrehabgroup"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Channel
              </label>
              <input
                type="url"
                value={contactInfo.youtube || ''}
                onChange={(e) => handleChange('youtube', e.target.value)}
                placeholder="https://youtube.com/@alrehabgroup"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Map Embed */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            Map Location
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Embed URL
            </label>
            <textarea
              value={contactInfo.mapEmbed || ''}
              onChange={(e) => handleChange('mapEmbed', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent font-mono text-sm"
              placeholder="Paste your Google Maps embed iframe code or URL here"
            />
            <p className="text-xs text-gray-500 mt-1">
              Go to Google Maps → Share → Embed a map → Copy the iframe code
            </p>
          </div>
          {contactInfo.mapEmbed && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 text-sm text-gray-600 border-b">
                Map Preview
              </div>
              <div className="aspect-video">
                {contactInfo.mapEmbed.includes('<iframe') ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: contactInfo.mapEmbed }}
                    className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                  />
                ) : (
                  <iframe
                    src={contactInfo.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end sticky bottom-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#2d7a3e] text-white px-6 py-3 rounded-lg hover:bg-[#1d5a2e] transition-colors disabled:opacity-50 shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
