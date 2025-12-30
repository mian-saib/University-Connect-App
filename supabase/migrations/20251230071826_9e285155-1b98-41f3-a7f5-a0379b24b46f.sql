-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create FAQs table for dynamic knowledge base
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can read FAQs)
CREATE POLICY "FAQs are publicly readable" 
ON public.faqs 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial FAQ data
INSERT INTO public.faqs (question, answer, category) VALUES
-- Admissions
('What programs are offered at UoP?', 'University of Peshawar offers Bachelor''s, Master''s, MPhil, and PhD programs in Arts, Science, Commerce, Law, Pharmacy, and Islamic Studies.', 'admissions'),
('What are the eligibility requirements for Bachelor''s programs?', 'For Bachelor''s programs, you need HSSC/FSc (Higher Secondary School Certificate) in the relevant field.', 'admissions'),
('When does admission open?', 'Admissions typically open in August for the fall semester and January for the spring semester.', 'admissions'),
('How do I apply for admission?', 'You can apply online through the admission portal at uop.edu.pk. Submit required documents including Matric, FSc/HSSC, Bachelor''s certificates (for Master''s), CNIC/Form-B, domicile, photos, and fee challan.', 'admissions'),
('Can I enroll in multiple programs?', 'No, only one regular program enrollment is allowed at a time.', 'admissions'),
('What documents are required for foreign students?', 'Foreign students must submit IBCC equivalence and follow HEC guidelines for admission.', 'admissions'),
-- Fees & Scholarships
('What is the fee structure for BS programs?', 'BS program fees range from PKR 15,000 to 30,000 per semester, varying by department.', 'fees'),
('How can I pay my fees?', 'Fees can be paid via bank challan (HBL, NBP) or through online banking.', 'fees'),
('What scholarships are available?', 'Available scholarships include HEC Need-Based, Merit-Based, and departmental scholarships. Apply at the Financial Aid Office with income certificates and transcripts.', 'fees'),
('Can I get a fee waiver?', 'Yes, fee waivers are available for deserving students. Contact the Financial Aid Office for details.', 'fees'),
('What is the refund policy?', 'Refunds are processed within 15 days if requested before the semester starts.', 'fees'),
-- Academics
('When are the semesters?', 'Fall semester runs from August to December, and Spring semester from January to May.', 'academics'),
('What grading system is used?', 'UoP uses a CGPA system on a 4.0 scale: A=4.0, B=3.0, C=2.0, D=1.0, F=0.', 'academics'),
('What is the minimum CGPA required?', 'A minimum 2.0 CGPA is required to remain in good academic standing.', 'academics'),
('What is the attendance requirement?', '75% attendance is mandatory for each course.', 'academics'),
('How are exams weighted?', 'Exams are typically weighted as: Mid-term (30%), assignments/quizzes (20%), final exam (50%).', 'academics'),
('Can I change my department?', 'Department change is possible within the first semester. Contact the Registrar''s Office for the procedure.', 'academics'),
('How many courses per semester?', 'Students typically take 5-6 courses (15-18 credit hours) per semester.', 'academics'),
('How do I request result re-evaluation?', 'Submit a re-evaluation request within 15 days of result announcement with the required fee.', 'academics'),
-- Hostel & Transport
('How do I apply for hostel accommodation?', 'Apply at the Provost Office at the start of the academic year. Priority is given to out-of-district students.', 'hostel'),
('What is the hostel fee?', 'Hostel fees range from PKR 8,000 to 15,000 per semester.', 'hostel'),
('What facilities are available in hostels?', 'Hostels provide mess facilities, Wi-Fi, common room, and 24/7 security.', 'hostel'),
('Are there separate hostels for boys and girls?', 'Yes, there are separate hostels for boys and girls with different in-time rules (10 PM for girls, 11 PM for boys).', 'hostel'),
('Is there university transport?', 'Yes, bus service is available at PKR 3,000-5,000 per semester covering various routes.', 'hostel'),
-- IT Support
('How do I get a university email?', 'University email (@uop.edu.pk) is provided after enrollment. Contact IT Department for activation.', 'it'),
('How do I access the student portal?', 'Access the portal at portal.uop.edu.pk using your registration number as username.', 'it'),
('Is there Wi-Fi on campus?', 'Yes, free Wi-Fi (UOP-WiFi) is available across the campus.', 'it'),
('How do I access the digital library?', 'Access the digital library at library.uop.edu.pk using your student credentials.', 'it'),
('Where is the IT Department located?', 'IT Department is located at IT Building, Ground Floor. Email: it.support@uop.edu.pk', 'it'),
-- Student Services
('Where is the Registrar''s Office?', 'Registrar''s Office is located in the Administration Block, open 8 AM to 4 PM.', 'services'),
('How do I get my student ID card?', 'Student ID cards are issued by the Student Affairs Office after enrollment.', 'services'),
('How long does it take to get transcripts?', 'Transcripts are processed by the Examination Department within 7-10 working days.', 'services'),
('Is there counseling available?', 'Yes, the Student Counseling Center offers free and confidential counseling services.', 'services'),
('What student clubs are available?', 'Available clubs include Debating, Drama, Sports, and Cultural clubs.', 'services'),
('Is there a medical center?', 'Yes, the Medical Center near the main library provides free basic healthcare services.', 'services'),
('How long does it take to get a character certificate?', 'Character certificates are processed within 3-5 working days.', 'services'),
('How do I get a migration certificate?', 'Migration certificates take 15-20 working days to process through the Registrar''s Office.', 'services');

-- Create index for faster category filtering
CREATE INDEX idx_faqs_category ON public.faqs(category);
CREATE INDEX idx_faqs_active ON public.faqs(is_active);