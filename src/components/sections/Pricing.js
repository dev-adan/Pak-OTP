'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 29, annual: 24 },
    features: [
      'Up to 1,000 authentications/month',
      'Basic API access',
      'Email support',
      'Standard security features',
      '99.9% uptime SLA'
    ],
    highlight: false,
    cta: 'Start Free Trial'
  },
  {
    name: 'Professional',
    price: { monthly: 79, annual: 69 },
    features: [
      'Up to 10,000 authentications/month',
      'Advanced API access',
      'Priority support',
      'Advanced security features',
      'Custom branding',
      '99.99% uptime SLA',
      'Detailed analytics'
    ],
    highlight: true,
    cta: 'Get Started'
  },
  {
    name: 'Enterprise',
    price: { monthly: 199, annual: 179 },
    features: [
      'Unlimited authentications',
      'Full API access',
      '24/7 dedicated support',
      'Enterprise security features',
      'Custom integration support',
      '99.999% uptime SLA',
      'Advanced analytics & reporting',
      'Multi-region deployment'
    ],
    highlight: false,
    cta: 'Contact Sales'
  }
];

const fadeInUp = {
  initial: { opacity: 1, y: 0 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2
    }
  }
};

const staggerContainer = {
  initial: { opacity: 1 },
  whileInView: {
    opacity: 1
  }
};

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <div className="relative">
      {/* Top gradient overlay for smooth transition */}
      <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-white via-gray-50 to-gray-50"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
            Flexible Plans
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your authentication needs. All plans include our core features with flexible usage limits.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center items-center space-x-3">
          <span className={`text-sm ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 bg-indigo-600"
            role="switch"
            aria-checked={isAnnual}
          >
            <span
              className={`${
                isAnnual ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Annual
            <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Save 20%
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 1, y: 0 }}
              onHoverStart={() => setHoveredPlan(index)}
              onHoverEnd={() => setHoveredPlan(null)}
              className={`relative rounded-2xl ${
                plan.highlight
                  ? 'bg-indigo-600 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
              } p-8 transition-all duration-300 ${
                hoveredPlan === index ? 'scale-[1.02]' : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-indigo-200 px-4 py-1 text-sm font-medium text-indigo-800 ring-1 ring-inset ring-indigo-300">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex flex-col h-full">
                <h3 className={`text-xl font-semibold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="ml-1 text-lg">/month</span>
                </div>
                {isAnnual && (
                  <p className={`mt-2 text-sm ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>
                    Billed annually
                  </p>
                )}

                <ul className="mt-8 space-y-4 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className={`h-5 w-5 flex-shrink-0 ${
                        plan.highlight ? 'text-indigo-200' : 'text-indigo-600'
                      }`} />
                      <span className="ml-3 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-8 w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all ${
                    plan.highlight
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Contact */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-16 text-center"
        >
          <p className="text-gray-600">
            Need a custom solution?{' '}
            <a href="#contact" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Contact our sales team
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
