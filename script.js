// Visual Subnet Calculator JavaScript

class SubnetCalculator {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const calculateBtn = document.getElementById('calculateBtn');
        const ipInput = document.getElementById('ipInput');
        
        calculateBtn.addEventListener('click', () => this.calculate());
        ipInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.calculate();
            }
        });
    }

    calculate() {
        const input = document.getElementById('ipInput').value.trim();
        this.clearError();
        
        if (!input) {
            this.showError('Please enter an IP address with CIDR notation (e.g., 192.168.1.10/24)');
            return;
        }

        // Show loading animation
        this.showLoading();

        // Add a small delay to show the loading animation
        setTimeout(() => {
            try {
                const { ip, cidr } = this.parseInput(input);
                const subnetInfo = this.calculateSubnetInfo(ip, cidr);
                this.displayResults(subnetInfo);
                this.updateVisualRepresentation(subnetInfo);
                this.animateResults();
            } catch (error) {
                this.showError(error.message);
            } finally {
                this.hideLoading();
            }
        }, 300);
    }

    parseInput(input) {
        const parts = input.split('/');
        if (parts.length !== 2) {
            throw new Error('Invalid format. Use IP/CIDR notation (e.g., 192.168.1.10/24)');
        }

        const ip = parts[0].trim();
        const cidr = parseInt(parts[1].trim());

        if (!this.isValidIP(ip)) {
            throw new Error('Invalid IP address format');
        }

        if (cidr < 0 || cidr > 32) {
            throw new Error('CIDR must be between 0 and 32');
        }

        return { ip, cidr };
    }

    isValidIP(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4) return false;
        
        return parts.every(part => {
            const num = parseInt(part);
            return !isNaN(num) && num >= 0 && num <= 255;
        });
    }

    calculateSubnetInfo(ip, cidr) {
        const ipParts = ip.split('.').map(Number);
        const ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
        
        // Calculate subnet mask
        const maskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0;
        const maskParts = [
            (maskInt >>> 24) & 0xFF,
            (maskInt >>> 16) & 0xFF,
            (maskInt >>> 8) & 0xFF,
            maskInt & 0xFF
        ];
        
        // Calculate network address
        const networkInt = (ipInt & maskInt) >>> 0;
        const networkParts = [
            (networkInt >>> 24) & 0xFF,
            (networkInt >>> 16) & 0xFF,
            (networkInt >>> 8) & 0xFF,
            networkInt & 0xFF
        ];
        
        // Calculate broadcast address
        const wildcardInt = ~maskInt >>> 0;
        const broadcastInt = (networkInt | wildcardInt) >>> 0;
        const broadcastParts = [
            (broadcastInt >>> 24) & 0xFF,
            (broadcastInt >>> 16) & 0xFF,
            (broadcastInt >>> 8) & 0xFF,
            broadcastInt & 0xFF
        ];
        
        // Calculate first and last usable IPs
        const firstUsableInt = networkInt + 1;
        const lastUsableInt = broadcastInt - 1;
        
        const firstUsableParts = [
            (firstUsableInt >>> 24) & 0xFF,
            (firstUsableInt >>> 16) & 0xFF,
            (firstUsableInt >>> 8) & 0xFF,
            firstUsableInt & 0xFF
        ];
        
        const lastUsableParts = [
            (lastUsableInt >>> 24) & 0xFF,
            (lastUsableInt >>> 16) & 0xFF,
            (lastUsableInt >>> 8) & 0xFF,
            lastUsableInt & 0xFF
        ];
        
        const totalHosts = Math.pow(2, 32 - cidr);
        const usableHosts = Math.max(0, totalHosts - 2);
        
        return {
            ip: ipParts,
            cidr,
            network: networkParts,
            broadcast: broadcastParts,
            mask: maskParts,
            firstUsable: firstUsableParts,
            lastUsable: lastUsableParts,
            totalHosts,
            usableHosts,
            networkBits: cidr,
            hostBits: 32 - cidr
        };
    }

    displayResults(info) {
        document.getElementById('networkAddress').textContent = info.network.join('.');
        document.getElementById('broadcastAddress').textContent = info.broadcast.join('.');
        document.getElementById('firstUsable').textContent = info.firstUsable.join('.');
        document.getElementById('lastUsable').textContent = info.lastUsable.join('.');
        document.getElementById('subnetMask').textContent = info.mask.join('.');
        document.getElementById('totalHosts').textContent = info.totalHosts.toLocaleString();
        document.getElementById('usableHosts').textContent = info.usableHosts.toLocaleString();
        
        // Binary representation
        document.getElementById('ipBinary').innerHTML = this.formatBinary(info.ip);
        document.getElementById('maskBinary').innerHTML = this.formatBinary(info.mask);
        document.getElementById('networkBinary').innerHTML = this.formatBinary(info.network);
    }

    formatBinary(parts) {
        return parts.map(part => {
            const binary = part.toString(2).padStart(8, '0');
            return `<span class="binary-octet">${binary}</span>`;
        }).join(' . ');
    }

    updateVisualRepresentation(info) {
        const networkPortion = document.getElementById('networkPortion');
        const hostPortion = document.getElementById('hostPortion');
        
        const networkPercent = (info.networkBits / 32) * 100;
        const hostPercent = (info.hostBits / 32) * 100;
        
        // Animate the visual representation
        setTimeout(() => {
            networkPortion.style.width = `${networkPercent}%`;
            hostPortion.style.width = `${hostPercent}%`;
            
            // Add text content to the bars if they're wide enough
            if (networkPercent > 20) {
                networkPortion.textContent = `Network (${info.networkBits})`;
            }
            if (hostPercent > 20) {
                hostPortion.textContent = `Hosts (${info.hostBits})`;
            }
        }, 100);
        
        // Update labels
        document.querySelector('.network-label').innerHTML = `🌐 Network Portion (${info.networkBits} bits)`;
        document.querySelector('.host-label').innerHTML = `🖥️ Host Portion (${info.hostBits} bits)`;
    }

    showLoading() {
        const loadingElement = document.getElementById('loadingAnimation');
        loadingElement.classList.remove('hidden');
        loadingElement.classList.add('flex');
    }

    hideLoading() {
        const loadingElement = document.getElementById('loadingAnimation');
        loadingElement.classList.add('hidden');
        loadingElement.classList.remove('flex');
    }

    animateResults() {
        // Add animation classes to result sections
        const sections = document.querySelectorAll('.bg-gray-800');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.5s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Clear results
        this.clearResults();
    }

    clearError() {
        const errorElement = document.getElementById('errorMessage');
        errorElement.classList.add('hidden');
    }

    clearResults() {
        const fields = [
            'networkAddress', 'broadcastAddress', 'firstUsable', 'lastUsable',
            'subnetMask', 'totalHosts', 'usableHosts', 'ipBinary', 'maskBinary', 'networkBinary'
        ];
        
        fields.forEach(field => {
            document.getElementById(field).textContent = '-';
        });
        
        // Reset visual representation
        document.getElementById('networkPortion').style.width = '0%';
        document.getElementById('hostPortion').style.width = '0%';
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SubnetCalculator();
});
