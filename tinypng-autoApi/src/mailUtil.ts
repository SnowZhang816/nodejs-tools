/*
 * @Author: 炒粉 380304468@qq.com
 * @Date: 2024-05-11 14:36:52
 * @LastEditors: 炒粉 380304468@qq.com
 * @LastEditTime: 2024-10-28 10:08:04
 * @FilePath: \tinypng-autoApi\src\mailUtil.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import MailBase from './emailCreator/mailBase';
import mailTempNet from './emailCreator/mailTempNet';
import mailTM from './emailCreator/mailTM';
import mailCx from './emailCreator/mailCX';

/** https://10minemail.com/ */
/** https://www.minuteinbox.com/ */

/** 邮箱工具类 */
class MailUtil {
    /**
     * 邮箱提供商列表
     * @param active 是否启用该邮箱提供商
     */
    mailProviderList = [
        { active: true, provider: mailTempNet },
        { active: false, provider: mailTM },
        { active: false, provider: mailCx }
    ];
    mailProvider: MailBase;

    constructor() {
        this.mailProvider = this.mailProviderList.find((e) => e.active)!.provider;
    }

    /** 获取邮箱 */
    async getMailAddress() {
        let email = await this.mailProvider.getMailAddress();
        return email;
    }

    /** 获取激活链接 */
    async getActiveLink() {
        let link = await this.mailProvider.getActiveLink();
        return link;
    }
}

const mailUtil = new MailUtil();
export default mailUtil;
