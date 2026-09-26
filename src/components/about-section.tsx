"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useProfile } from "@/hooks/useProfile";

const gradients = [
  "from-teal-500 to-cyan-500",
  "from-violet-500 to-purple-500",
  "from-rose-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-emerald-500",
  "from-indigo-500 to-purple-500",
  "from-yellow-500 to-orange-500",
];

export function AboutSection() {
  const { profile, loading } = useProfile();
  const skills = profile.skills;
  const t = useTranslations("About");

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-[rgb(27,27,27)] dark:via-[rgb(20,20,20)] dark:to-[rgb(15,15,15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {t("whatIDo")}
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            {profile.bio || "I specialize in creating innovative web applications that combine cutting-edge technology with exceptional user experiences."}
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        {!loading && skills.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            {t("noSkills")}{" "}
            <a href="/dashboard/profile" className="underline hover:text-purple-600 dark:hover:text-purple-300">
              {t("dashboard")}
            </a>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => {
              const gradient = gradients[index % gradients.length];
              return (
                <motion.div
                  key={skill}
                  className="group relative p-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-gray/20 dark:border-white/10 hover:border-purple-300/50 dark:hover:border-purple-300/30 transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-1"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-200 ease-out`}></div>

                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200 ease-out`}>
                      <div className="text-white">
                        <Sparkles className="w-8 h-8" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-200 ease-out">
                      {skill}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-2xl border border-purple-300/20 dark:border-purple-300/10"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🚀
            </motion.div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("readyToBuild")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("readyToBuildDescription")}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
