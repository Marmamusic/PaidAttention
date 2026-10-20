<?php
/**
 * Plugin Name: PaidAttention — Pay Attention Online (60s Creator Monetization)
 * Plugin URI:  https://github.com/Marmamusic/PaidAttention
 * Description: Turn genuine visitor attention on your WordPress site into micropayment revenue (excluding clickbait) in 60 seconds. Supports Direct MetaMask Wallet or Zero-Wallet Domain URL mode.
 * Version:     2.0.0
 * Author:      Marmamusic
 * Author URI:  https://github.com/Marmamusic
 * License:     MIT
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Inject <meta name="paidattention"> tag into website <head>
function paidattention_inject_meta_tag() {
    $mode       = get_option('paidattention_mode', 'domain');
    $wallet     = trim(get_option('paidattention_wallet', ''));
    $domain     = trim(get_option('paidattention_domain', parse_url(home_url(), PHP_URL_HOST)));
    $category   = get_option('paidattention_category', 'UN_PAYWALLED');
    $t_grace    = intval(get_option('paidattention_t_grace', 15));
    $t_cap      = intval(get_option('paidattention_t_cap', 120));
    $p_cap      = floatval(get_option('paidattention_p_cap', 0.015));

    if ($mode === 'wallet' && !empty($wallet)) {
        $content_attr = 'wallet:' . esc_attr($wallet);
    } else {
        $content_attr = 'domain:' . esc_attr($domain);
    }

    echo "\n<!-- PaidAttention v2.0 — Pay Attention Online (https://github.com/Marmamusic/PaidAttention) -->\n";
    printf(
        '<meta name="paidattention" content="%s" data-category="%s" data-t-grace="%d" data-t-cap="%d" data-p-cap="%.3f" />' . "\n",
        $content_attr,
        esc_attr($category),
        $t_grace,
        $t_cap,
        $p_cap
    );
}
add_action('wp_head', 'paidattention_inject_meta_tag', 1);

// 2. Register WordPress Admin Settings Menu (Settings -> PaidAttention)
function paidattention_register_settings_menu() {
    add_options_page(
        'PaidAttention Settings',
        '⚡ PaidAttention',
        'manage_options',
        'paidattention-settings',
        'paidattention_render_settings_page'
    );
}
add_action('admin_menu', 'paidattention_register_settings_menu');

function paidattention_register_settings() {
    register_setting('paidattention_options_group', 'paidattention_mode');
    register_setting('paidattention_options_group', 'paidattention_wallet');
    register_setting('paidattention_options_group', 'paidattention_domain');
    register_setting('paidattention_options_group', 'paidattention_category');
    register_setting('paidattention_options_group', 'paidattention_t_grace');
    register_setting('paidattention_options_group', 'paidattention_t_cap');
    register_setting('paidattention_options_group', 'paidattention_p_cap');
}
add_action('admin_init', 'paidattention_register_settings');

function paidattention_render_settings_page() {
    $default_domain = parse_url(home_url(), PHP_URL_HOST);
    ?>
    <div class="wrap">
        <h1>⚡ PaidAttention — Monetize Your Website in 60 Seconds</h1>
        <p>Reward your site for genuine visitor focus (while filtering out clickbait with a 15-second free preview countdown).</p>
        <form method="post" action="options.php">
            <?php settings_fields('paidattention_options_group'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">Payout Method</th>
                    <td>
                        <select name="paidattention_mode">
                            <option value="wallet" <?php selected(get_option('paidattention_mode', 'domain'), 'wallet'); ?>>
                                1. Direct Wallet (MetaMask / Base L2) — Fastest Instant Payouts (Recommended)
                            </option>
                            <option value="domain" <?php selected(get_option('paidattention_mode', 'domain'), 'domain'); ?>>
                                2. Zero-Wallet Domain Escrow — Start Now, Redeem Later via Passkey or Bank
                            </option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row">MetaMask / L2 Wallet Address</th>
                    <td>
                        <input type="text" name="paidattention_wallet" value="<?php echo esc_attr(get_option('paidattention_wallet', '')); ?>" class="regular-text code" placeholder="0xYourWalletAddress..." />
                        <p class="description">Used when Payout Method is set to Direct Wallet.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Website Domain</th>
                    <td>
                        <input type="text" name="paidattention_domain" value="<?php echo esc_attr(get_option('paidattention_domain', $default_domain)); ?>" class="regular-text code" />
                        <p class="description">Used when Payout Method is set to Zero-Wallet Domain Escrow.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Free Preview Countdown (Seconds)</th>
                    <td>
                        <input type="number" name="paidattention_t_grace" value="<?php echo esc_attr(get_option('paidattention_t_grace', 15)); ?>" min="5" max="30" />
                        <p class="description">Visitors who leave before this countdown finishes pay $0.00.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Max Price Cap per Visit ($ USD)</th>
                    <td>
                        <input type="text" name="paidattention_p_cap" value="<?php echo esc_attr(get_option('paidattention_p_cap', '0.015')); ?>" />
                        <p class="description">Default: 0.015 ($0.015 max per article read).</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save PaidAttention Settings'); ?>
        </form>
    </div>
    <?php
}
