/* 
 * 作者：钟勋 (e-mail:zhongxunking@163.com)
 */

/*
 * 修订记录:
 * @author 钟勋 2018-01-24 09:06 创建
 */
package org.antframework.manager.biz.provider;

import org.antframework.boot.bekit.CommonQueryConstant;
import org.antframework.boot.bekit.CommonQueryResult;
import org.antframework.common.util.facade.EmptyResult;
import org.antframework.manager.biz.util.QueryUtils;
import org.antframework.manager.dal.dao.ManagerDao;
import org.antframework.manager.facade.api.ManagerService;
import org.antframework.manager.facade.order.*;
import org.antframework.manager.facade.result.ManagerLoginResult;
import org.antframework.manager.facade.result.QueryManagerResult;
import org.bekit.service.ServiceEngine;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 故那里远服务提供者
 */
public class ManagerServiceProvider implements ManagerService {
    @Autowired
    private ServiceEngine serviceEngine;

    @Override
    public EmptyResult addManager(AddManagerOrder order) {
        return serviceEngine.execute("addManagerService", order);
    }

    @Override
    public EmptyResult deleteManager(DeleteManagerOrder order) {
        return serviceEngine.execute("deleteManagerService", order);
    }

    @Override
    public EmptyResult modifyManagerPassword(ModifyManagerPasswordOrder order) {
        return serviceEngine.execute("modifyManagerPasswordService", order);
    }

    @Override
    public EmptyResult modifyManagerType(ModifyManagerTypeOrder order) {
        return serviceEngine.execute("modifyManagerTypeService", order);
    }

    @Override
    public EmptyResult modifyManagerName(ModifyManagerNameOrder order) {
        return serviceEngine.execute("modifyManagerNameService", order);
    }

    @Override
    public QueryManagerResult queryManager(QueryManagerOrder order) {
        CommonQueryResult result = serviceEngine.execute(CommonQueryConstant.SERVICE_NAME, order, QueryUtils.buildCommonQueryAttachment(ManagerDao.class));
        return result.convertTo(QueryManagerResult.class);
    }

    @Override
    public ManagerLoginResult managerLogin(ManagerLoginOrder order) {
        return serviceEngine.execute("managerLoginService", order);
    }
}