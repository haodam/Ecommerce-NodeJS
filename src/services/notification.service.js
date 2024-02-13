const { NOTI } = require("../models/notification.model");

const pushNotiToSystem = async ({
  noti_type = "SHOP-001",
  noti_senderId = 1,
  noti_receivedId = 1,
  noti_options = {},
}) => {
  let noti_content; // Khai báo biến noti_content ở đây

  if (noti_type === "SHOP-001") {
    noti_content = `${noti_senderId} đã thêm sản phẩm mới`;
  } else if (noti_type === "POMOTION-001") {
    noti_content = `${noti_senderId} đã đặt hàng thành công`;
  }

  const newNoti = await NOTI.create({
    noti_type: noti_type,
    noti_content,
    noti_senderId: noti_senderId,
    noti_receivedId: noti_receivedId,
    noti_options: noti_options,
  });

  return newNoti;
};


const listNotiByUser = async({
    userId = 1,
    type = 'ALL',
    isReal = 0
    
}) => {
    const match = {noti_receivedId : userId}
    if(type !== 'ALL')  {
        match['noti_type'] = type
    }

    return await NOTI.aggregate([
        {
            $match : match,
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_content: 1,
                noti_options: 1,
                createdAt: 1,
            }
        }
    ])
}

module.exports = {
  pushNotiToSystem,
  listNotiByUser
};