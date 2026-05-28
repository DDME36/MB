import * as lucide from 'lucide-react';
const keys = Object.keys(lucide);
console.log('Total keys:', keys.length);
console.log('Has Youtube:', keys.includes('Youtube'));
console.log('Has Instagram:', keys.includes('Instagram'));
console.log('Has MessageCircle:', keys.includes('MessageCircle'));
console.log('Has Mail:', keys.includes('Mail'));
console.log('Sample keys (first 100):', keys.slice(0, 100));
