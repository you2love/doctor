// 人体系统动画展示 - JavaScript 交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 获取所有导航按钮
    const navButtons = document.querySelectorAll('.nav-btn');
    const systemDisplays = document.querySelectorAll('.system-display');

    // 为每个导航按钮添加点击事件
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const systemName = this.dataset.system;

            // 移除所有按钮的active类
            navButtons.forEach(btn => btn.classList.remove('active'));

            // 为当前按钮添加active类
            this.classList.add('active');

            // 隐藏所有系统展示
            systemDisplays.forEach(display => {
                display.classList.add('fade-out');
                setTimeout(() => {
                    display.style.display = 'none';
                    display.classList.remove('fade-out');
                }, 300);
            });

            // 显示选中的系统
            setTimeout(() => {
                const selectedDisplay = document.getElementById(`${systemName}-system`);
                if (selectedDisplay) {
                    selectedDisplay.style.display = 'block';
                    selectedDisplay.classList.add('fade-in');
                    setTimeout(() => {
                        selectedDisplay.classList.remove('fade-in');
                    }, 300);
                }
            }, 300);
        });
    });

    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        const activeButton = document.querySelector('.nav-btn.active');
        if (!activeButton) return;

        const currentIndex = Array.from(navButtons).indexOf(activeButton);
        let nextIndex;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                nextIndex = (currentIndex - 1 + navButtons.length) % navButtons.length;
                navButtons[nextIndex].click();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextIndex = (currentIndex + 1) % navButtons.length;
                navButtons[nextIndex].click();
                break;
        }
    });

    // 添加触摸滑动支持（移动端）
    let touchStartX = 0;
    let touchEndX = 0;

    const systemContainer = document.querySelector('.system-container');

    systemContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    systemContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const activeButton = document.querySelector('.nav-btn.active');
        if (!activeButton) return;

        const swipeThreshold = 50;
        const currentIndex = Array.from(navButtons).indexOf(activeButton);
        let nextIndex;

        if (touchEndX < touchStartX - swipeThreshold) {
            // 向左滑动 - 下一个
            nextIndex = (currentIndex + 1) % navButtons.length;
            navButtons[nextIndex].click();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // 向右滑动 - 上一个
            nextIndex = (currentIndex - 1 + navButtons.length) % navButtons.length;
            navButtons[nextIndex].click();
        }
    }

    // 自动播放功能（可选）
    let autoPlayInterval = null;
    let isAutoPlaying = false;

    function startAutoPlay() {
        if (isAutoPlaying) return;

        isAutoPlaying = true;
        let currentIndex = 0;

        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % navButtons.length;
            navButtons[currentIndex].click();
        }, 8000); // 每8秒切换一次

        console.log('自动播放已启动');
    }

    function stopAutoPlay() {
        if (!isAutoPlaying) return;

        clearInterval(autoPlayInterval);
        isAutoPlaying = false;
        console.log('自动播放已停止');
    }

    // 添加动画暂停/播放控制
    const svgElements = document.querySelectorAll('.system-svg');

    function toggleAnimations(pause) {
        svgElements.forEach(svg => {
            svg.style.animationPlayState = pause ? 'paused' : 'running';
        });

        // 暂停所有SVG内部动画
        const animatedElements = svgElements[0].querySelectorAll('*[animate], *[animateMotion]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = pause ? 'paused' : 'running';
        });
    }

    // 页面可见性变化时暂停动画
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            toggleAnimations(true);
            stopAutoPlay();
        } else {
            toggleAnimations(false);
            // 可以选择是否恢复自动播放
        }
    });

    // 添加鼠标悬停暂停功能
    systemContainer.addEventListener('mouseenter', function() {
        toggleAnimations(true);
        if (isAutoPlaying) stopAutoPlay();
    });

    systemContainer.addEventListener('mouseleave', function() {
        toggleAnimations(false);
        // 可以选择是否恢复自动播放
    });

    // 添加控制面板（可选）
    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'control-panel';
        controlPanel.innerHTML = `
            <button id="auto-play-btn" class="control-btn">
                <span class="icon">▶️</span>
                <span>自动播放</span>
            </button>
            <button id="pause-btn" class="control-btn">
                <span class="icon">⏸️</span>
                <span>暂停</span>
            </button>
        `;

        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(controlPanel, systemContainer);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .control-panel {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 15px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .control-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 1rem;
                transition: transform 0.2s ease;
            }

            .control-btn:hover {
                transform: scale(1.05);
            }

            .control-btn.active {
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
            }
        `;

        document.head.appendChild(style);

        // 添加事件监听器
        const autoPlayBtn = document.getElementById('auto-play-btn');
        const pauseBtn = document.getElementById('pause-btn');

        autoPlayBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                startAutoPlay();
                this.innerHTML = '<span class="icon">⏹️</span><span>停止</span>';
            } else {
                stopAutoPlay();
                this.innerHTML = '<span class="icon">▶️</span><span>自动播放</span>';
            }
        });

        let isPaused = false;
        pauseBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            isPaused = !isPaused;
            toggleAnimations(isPaused);
            if (isPaused) {
                this.innerHTML = '<span class="icon">▶️</span><span>播放</span>';
            } else {
                this.innerHTML = '<span class="icon">⏸️</span><span>暂停</span>';
            }
        });
    }

    // 初始化控制面板
    createControlPanel();

    // 性能优化：对不可见的系统暂停动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const svg = entry.target.querySelector('.system-svg');
            if (svg) {
                if (entry.isIntersecting) {
                    svg.style.animationPlayState = 'running';
                } else {
                    svg.style.animationPlayState = 'paused';
                }
            }
        });
    }, {
        threshold: 0.1
    });

    systemDisplays.forEach(display => {
        observer.observe(display);
    });

    console.log('人体系统动画展示已加载完成！');
    console.log('快捷键：');
    console.log('- 左右箭头：切换系统');
    console.log('- 移动端：左右滑动切换系统');
});
