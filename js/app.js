/**
 * NexusRank Pro - Enhanced AI SEO Toolkit
 * Advanced AI-powered tools for professional content creation
 */

class NexusRankApp {
  constructor() {
    // ✅ API Configuration
    this.apiBaseUrl = 'https://newsseotools1.shahshameer383.workers.dev';
    this.patreonUrl = 'https://www.patreon.com/posts/seo-tools-137228615?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=postshare_creator&utm_content=join_link';

    this.currentTool = null;
    this.isProUser = false;
    this.usageData = {};

    this.init();
  }

  init() {
    this.loadUsageData();
    this.checkProStatus();
    this.bindEvents();
    this.initializeNavigation();
  }

  loadUsageData() {
    const stored = localStorage.getItem('nexusrank_usage');
    if (stored) {
      this.usageData = JSON.parse(stored);
    } else {
      this.usageData = {
        'seo-write': 0,
        'humanize': 0,
        'detect': 0,
        'paraphrase': 0,
        'grammar': 0,
        'improve': 0
      };
      this.saveUsageData();
    }
  }

  saveUsageData() {
    localStorage.setItem('nexusrank_usage', JSON.stringify(this.usageData));
  }

  checkProStatus() {
    const proStatus = localStorage.getItem('nexusrank_pro');
    if (proStatus === 'true') {
      this.isProUser = true;
    }
  }

  setProStatus(status) {
    this.isProUser = status;
    localStorage.setItem('nexusrank_pro', status.toString());
  }

  bindEvents() {
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }

    // Unlimited Access button
    const unlimitedBtn = document.getElementById('unlimited-access-btn');
    if (unlimitedBtn) {
      unlimitedBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(this.patreonUrl, '_blank');
      });
    }

    // Tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
      card.addEventListener('click', () => {
        const tool = card.dataset.tool;
        if (tool) {
          this.openTool(tool);
        }
      });
    });

    // Footer tool links
    const footerToolLinks = document.querySelectorAll('.footer-links a[data-tool]');
    footerToolLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tool = link.dataset.tool;
        if (tool) {
          this.openTool(tool);
        }
      });
    });

    // Modal events
    this.bindModalEvents();
  }

  bindModalEvents() {
    const toolModal = document.getElementById('tool-modal');
    const proModal = document.getElementById('pro-modal');
    const processBtn = document.getElementById('process-btn');
    const clearBtn = document.getElementById('clear-input');
    const copyBtn = document.getElementById('copy-output');
    const downloadBtn = document.getElementById('download-output');
    const proLoginBtn = document.getElementById('pro-login-btn');
    const unlimitedAccessBtn = document.getElementById('unlimited-access-modal-btn');

    // Close modals
    document.querySelectorAll('.modal-close').forEach(close => {
      close.addEventListener('click', () => this.closeModals());
    });

    [toolModal, proModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.closeModals();
        });
      }
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModals();
    });

    // Process button
    if (processBtn) {
      processBtn.addEventListener('click', () => this.processTool());
    }

    // Clear input
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        document.getElementById('tool-input').value = '';
      });
    }

    // Copy output
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    // Download output
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadOutput());
    }

    // Pro login
    if (proLoginBtn) {
      proLoginBtn.addEventListener('click', () => this.handleProLogin());
    }

    // Unlimited access button in modal
    if (unlimitedAccessBtn) {
      unlimitedAccessBtn.addEventListener('click', () => {
        window.open(this.patreonUrl, '_blank');
      });
    }

    // Enter key for login
    ['pro-username', 'pro-password'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.handleProLogin();
        });
      }
    });

    // Ctrl+Enter to process
    const toolInput = document.getElementById('tool-input');
    if (toolInput) {
      toolInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) this.processTool();
      });
    }
  }

  initializeNavigation() {
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle && navMenu) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });
    });

    // Active nav link
    const sections = ['hero', 'tools'];
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop - 100;
          if (window.pageYOffset >= sectionTop) {
            current = sectionId === 'hero' ? '' : sectionId;
          }
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if ((!current && link.getAttribute('href') === '/') ||
            (current && link.getAttribute('href').includes(current))) {
          link.classList.add('active');
        }
      });
    });
  }

  openTool(toolName) {
    this.currentTool = toolName;
    const modal = document.getElementById('tool-modal');
    const modalTitle = document.getElementById('modal-title');
    const toolInput = document.getElementById('tool-input');
    const outputSection = document.getElementById('output-section');
    const usageCount = document.getElementById('usage-count');

    if (!modal || !modalTitle) return;

    const toolConfig = this.getToolConfig(toolName);
    modalTitle.textContent = toolConfig.title;

    if (toolInput) {
      toolInput.placeholder = toolConfig.placeholder;
      toolInput.value = '';
    }

    if (outputSection) {
      outputSection.style.display = 'none';
    }

    if (usageCount) {
      const remaining = this.isProUser ? '∞' : Math.max(0, 1 - this.usageData[toolName]);
      usageCount.textContent = remaining;
    }

    modal.classList.add('active');
    if (toolInput) toolInput.focus();
  }

  getToolConfig(toolName) {
    const configs = {
      'seo-write': {
        title: 'Advanced AI SEO Writer',
        placeholder: 'Enter your topic or keywords for a comprehensive, SEO-optimized article (e.g., "Benefits of yoga for mental health", "Digital marketing strategies 2025")...',
        endpoint: '/ai/seo-write'
      },
      'humanize': {
        title: 'AI Text Humanizer',
        placeholder: 'Paste AI-generated text to transform into natural, human-like content that passes all detection tools...',
        endpoint: '/ai/humanize'
      },
      'detect': {
        title: 'Advanced AI Detector',
        placeholder: 'Paste text to analyze for AI-generated content with detailed probability scoring and analysis...',
        endpoint: '/ai/detect'
      },
      'paraphrase': {
        title: 'Professional Paraphrasing Tool',
        placeholder: 'Enter text to rewrite into completely unique, high-quality content while preserving the original meaning...',
        endpoint: '/ai/paraphrase'
      },
      'grammar': {
        title: 'Advanced Grammar Checker',
        placeholder: 'Paste text to fix grammar, spelling, punctuation and enhance professional quality...',
        endpoint: '/ai/grammar'
      },
      'improve': {
        title: 'Professional Text Improver',
        placeholder: 'Enter text to enhance clarity, engagement, and professionalism for maximum impact...',
        endpoint: '/ai/improve'
      }
    };

    return configs[toolName] || {
      title: 'Advanced AI Tool',
      placeholder: 'Enter your text...',
      endpoint: '/ai/improve'
    };
  }

  async processTool() {
    const toolInput = document.getElementById('tool-input');
    const processBtn = document.getElementById('process-btn');

    if (!toolInput || !this.currentTool) return;

    const inputText = toolInput.value.trim();
    if (!inputText) {
      this.showToast('Please enter some text to process.', 'error');
      return;
    }

    // ✅ CHANGED: Show pro modal after 1 free use (instead of 2)
    if (!this.isProUser && this.usageData[this.currentTool] >= 1) {
      this.showProModal();
      return;
    }

    this.showLoading(true);
    if (processBtn) {
      processBtn.disabled = true;
      const btnText = processBtn.querySelector('span');
      if (btnText) btnText.textContent = 'Processing...';
    }

    try {
      const result = await this.callAI(inputText);

      if (result.success) {
        this.showOutput(result.content);
        if (!this.isProUser) {
          this.usageData[this.currentTool]++;
          this.saveUsageData();
          this.updateUsageDisplay();
        }
        this.showToast('Content processed successfully with advanced AI!', 'success');
      } else {
        this.showToast(result.error || 'Failed to process text.', 'error');
      }
    } catch (error) {
      console.error('Processing error:', error);
      this.showToast('Network error. Please try again.', 'error');
    } finally {
      this.showLoading(false);
      if (processBtn) {
        processBtn.disabled = false;
        const btnText = processBtn.querySelector('span');
        if (btnText) btnText.textContent = 'Process Text';
      }
    }
  }

  async callAI(inputText) {
    const toolConfig = this.getToolConfig(this.currentTool);

    try {
      const response = await fetch(`${this.apiBaseUrl}${toolConfig.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call error:', error);
      return {
        success: false,
        error: error.message || 'Failed to connect to AI service'
      };
    }
  }

  showOutput(content) {
    const outputSection = document.getElementById('output-section');
    const toolOutput = document.getElementById('tool-output');

    if (outputSection && toolOutput) {
      toolOutput.value = content;
      outputSection.style.display = 'block';
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.toggle('active', show);
    }
  }

  showProModal() {
    const proModal = document.getElementById('pro-modal');
    if (proModal) {
      proModal.classList.add('active');
    }
  }

  closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  updateUsageDisplay() {
    const usageCount = document.getElementById('usage-count');
    if (usageCount && this.currentTool) {
      const remaining = this.isProUser ? '∞' : Math.max(0, 1 - this.usageData[this.currentTool]);
      usageCount.textContent = remaining;
    }
  }

  async copyToClipboard() {
    const toolOutput = document.getElementById('tool-output');
    if (!toolOutput || !toolOutput.value) {
      this.showToast('No content to copy', 'warning');
      return;
    }

    try {
      await navigator.clipboard.writeText(toolOutput.value);
      this.showToast('Content copied to clipboard!', 'success');
    } catch (error) {
      toolOutput.select();
      document.execCommand('copy');
      this.showToast('Content copied to clipboard!', 'success');
    }
  }

  downloadOutput() {
    const toolOutput = document.getElementById('tool-output');
    if (!toolOutput || !toolOutput.value) {
      this.showToast('No content to download', 'warning');
      return;
    }

    const toolConfig = this.getToolConfig(this.currentTool);
    const filename = `${toolConfig.title.replace(/\s+/g, '_').toLowerCase()}_output.txt`;
    const blob = new Blob([toolOutput.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('Content downloaded successfully!', 'success');
  }

  handleProLogin() {
    const username = document.getElementById('pro-username')?.value;
    const password = document.getElementById('pro-password')?.value;

    if (!username || !password) {
      this.showToast('Please enter your Pro credentials. Contact support for Pro access after payment.', 'warning');
      return;
    }

    // This would be replaced with actual authentication
    this.showToast('Pro authentication is available after payment. Please contact support for credentials.', 'info');
  }

  showToast(message, type = 'info') {
    const existing = document.querySelectorAll('.toast');
    existing.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('active'), 100);
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.nexusRankApp = new NexusRankApp();
});

// Service worker update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}